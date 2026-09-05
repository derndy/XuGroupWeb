#!/usr/bin/env python3
"""Audit built publication HTML using only the Python standard library.

Usage: python scripts/audit-publications.py BUILD_DIR [--before BASELINE_BUILD_DIR]
This checks generated structure/preservation, not browser layout or remote URLs.
"""

import argparse
import base64
import hashlib
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit


class Node:
    def __init__(self, tag="root", attrs=()):
        self.tag = tag
        self.attrs = dict(attrs)
        self.children = []

    def has_class(self, name):
        return name in self.attrs.get("class", "").split()

    def walk(self):
        yield self
        for child in self.children:
            if isinstance(child, Node):
                yield from child.walk()

    def find(self, predicate):
        return [node for node in self.walk() if predicate(node)]

    def text(self):
        return "".join(child.text() if isinstance(child, Node) else child for child in self.children)


class Document(HTMLParser):
    VOID = set("area base br col embed hr img input link meta param source track wbr".split())

    def __init__(self, path):
        super().__init__(convert_charrefs=True)
        self.root = Node()
        self.stack = [self.root]
        self.feed(path.read_text(encoding="utf-8"))
        self.close()

    def handle_starttag(self, tag, attrs):
        node = Node(tag, attrs)
        self.stack[-1].children.append(node)
        if tag not in self.VOID:
            self.stack.append(node)

    def handle_endtag(self, tag):
        for index in range(len(self.stack) - 1, 0, -1):
            if self.stack[index].tag == tag:
                del self.stack[index:]
                break

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag not in self.VOID:
            self.handle_endtag(tag)

    def handle_data(self, data):
        self.stack[-1].children.append(data)


def require(condition, message):
    if not condition:
        raise SystemExit(f"FAIL: {message}")


def normalized(node):
    return " ".join(node.text().split())


def signature(record, legacy=False):
    if legacy:
        citation = record.find(lambda node: node.has_class("pub-list-item"))[0]
        title = next(child for child in citation.children if isinstance(child, Node) and child.tag == "a")
        authors = record.find(lambda node: node.has_class("li-cite-author"))[0]
        actions = record.find(lambda node: node.tag == "a" and node.has_class("btn-page-header"))
    else:
        heading = record.find(lambda node: node.tag == "h3")[0]
        title = heading.find(lambda node: node.tag == "a")[0]
        authors = record.find(lambda node: node.has_class("publication-record__authors"))[0]
        actions = record.find(lambda node: node.tag == "a" and node.has_class("btn-page-header"))
    author_links = [(normalized(node), node.attrs.get("href")) for node in authors.find(lambda node: node.tag == "a")]
    action_links = [(normalized(node), *(node.attrs.get(key) for key in ("href", "data-filename", "target", "rel"))) for node in actions]
    return (normalized(title), title.attrs["href"], normalized(authors), author_links, action_links)


def local_file(build, href):
    path = urlsplit(href).path
    require(path.startswith("/"), f"Expected a root-relative local URL: {href}")
    target = build / unquote(path).lstrip("/")
    if path.endswith("/"):
        target /= "index.html"
    require(target.is_file(), f"Missing built destination: {href}")
    return target


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("build", type=Path)
    parser.add_argument("--before", type=Path)
    args = parser.parse_args()
    doc = Document(args.build / "publication/index.html").root
    mains = doc.find(lambda node: node.tag == "main")
    require(len(mains) == 1, "Expected one main landmark")
    main_node = mains[0]
    require(len(main_node.find(lambda node: node.tag == "h1")) == 1, "Expected one H1")
    nodes = list(main_node.walk())
    ids = [node.attrs["id"] for node in doc.walk() if "id" in node.attrs]
    require(len(ids) == len(set(ids)), "Duplicate document IDs")
    for node in nodes:
        require("style" not in node.attrs, "Unexpected inline style")
        require(not any(key.startswith("on") for key in node.attrs), "Unexpected inline event handler")
        for key in ("aria-labelledby", "aria-describedby"):
            require(all(value in ids for value in node.attrs.get(key, "").split()), f"Unresolved {key}")
        if node.tag == "a" and node.attrs.get("href", "").startswith("#") and node.attrs["href"] != "#":
            require(node.attrs["href"][1:] in ids, f"Broken anchor {node.attrs['href']}")

    forms = main_node.find(lambda node: "data-publication-filters" in node.attrs)
    require(len(forms) == 1 and "hidden" in forms[0].attrs, "Filters must start hidden until initialized")
    label_targets = {node.attrs.get("for") for node in forms[0].find(lambda node: node.tag == "label")}
    for field in forms[0].find(lambda node: node.tag in ("input", "select")):
        require(field.attrs.get("id") in label_targets, "Unlabelled filter control")

    records = main_node.find(lambda node: "data-publication-record" in node.attrs)
    groups = main_node.find(lambda node: "data-publication-year" in node.attrs)
    require(all("hidden" not in node.attrs for node in records + groups), "No-JS index must show all records")
    dates = [record.find(lambda node: node.tag == "time")[0].attrs["datetime"] for record in records]
    require(dates == sorted(dates, reverse=True), "Publication ordering is not newest first")
    require({node.attrs["data-year"] for node in records} == {node.attrs["data-publication-year"] for node in groups}, "Year groups do not match records")
    type_select = forms[0].find(lambda node: node.attrs.get("id") == "publication-type")[0]
    types = {node.attrs.get("value") or "" for node in type_select.find(lambda node: node.tag == "option")} - {""}
    require(types == {kind for node in records for kind in node.attrs["data-types"].split()}, "Type options do not match records")
    count = main_node.find(lambda node: "data-publication-count" in node.attrs)[0]
    require(normalized(count) == f"Showing {len(records)} of {len(records)} records", "Incorrect initial result count")
    require(count.attrs.get("role") == "status", "Missing live result status")

    for record in records:
        local_file(args.build, signature(record)[1])
        for link in record.find(lambda node: node.tag == "a"):
            if "data-filename" in link.attrs:
                local_file(args.build, link.attrs["data-filename"])
            if link.has_class("publication-bib"):
                require("download" in link.attrs, "BibTeX must be a direct download")
                local_file(args.build, link.attrs["href"])

    scripts = main_node.find(lambda node: node.tag == "script")
    require(len(scripts) == 1 and "defer" in scripts[0].attrs, "Expected one deferred filter script")
    script = scripts[0]
    digest = base64.b64encode(hashlib.sha256(local_file(args.build, script.attrs["src"]).read_bytes()).digest()).decode()
    require(script.attrs.get("integrity") == f"sha256-{digest}", "Script integrity mismatch")
    require(bool(doc.find(lambda node: node.tag == "meta" and node.attrs.get("name") == "description" and node.attrs.get("content"))), "Missing description")
    require(bool(doc.find(lambda node: node.tag == "link" and node.attrs.get("rel") == "canonical")), "Missing canonical URL")

    if args.before:
        old = Document(args.before / "publication/index.html").root
        old_records = old.find(lambda node: "data-publication-record" in node.attrs)
        legacy = not old_records
        if legacy:
            old_records = old.find(lambda node: node.has_class("isotope-item"))
        require([signature(node, legacy) for node in old_records] == [signature(node) for node in records], "Baseline titles, authors, order, routes, or attachment controls changed")
        for record in records:
            for link in record.find(lambda node: "data-filename" in node.attrs):
                href = link.attrs["data-filename"]
                require(local_file(args.before, href).read_bytes() == local_file(args.build, href).read_bytes(), f"Citation file changed: {href}")
        print("PASS: baseline titles, author text/links, order, routes, attachment controls, and citation bytes preserved")

    print(f"PASS: {len(records)} records, {len(groups)} years, {len(types)} types; structure, local record/citation paths, and script integrity")


if __name__ == "__main__":
    main()
