# Publications maintenance

## Scope and source of truth

The Publications index reads the existing Hugo page bundles. It is a text-first bibliography, not a gallery of paper thumbnails or a second publication database. Titles, author order and notes, dates, venue text, record types, DOI values, links, citation files, and detail pages remain canonical in `content/publication/<record>/`.

| File | Responsibility |
| --- | --- |
| `content/publication/_index.md` | Index title and search description |
| `content/publication/<record>/index.md` | Existing publication metadata and abstract |
| `content/publication/<record>/cite.bib` | Existing downloadable citation |
| `layouts/publication/list.html` | Newest-first year index and filter controls |
| `layouts/partials/publications/record.html` | One source-backed record and existing attachment controls |
| `assets/scss/_publications.scss` | Styles scoped to this index, imported by `template.scss` |
| `assets/js/publications.mjs` | Progressive search, type/year intersection, count, reset, and bookmark support |
| `tests/publications.test.mjs` | Dependency-free search and UI-state tests |
| `scripts/audit-publications.py` | Dependency-free generated-HTML and baseline-preservation checks |

The single-record templates, author taxonomy, and BibTeX import workflow are unchanged. Slice 09 preserved the publication bundles; Slice 10 makes four source-verified record corrections documented in [the DOI audit](publication-link-audit-2026-09-05.md). The index does not infer Pillar membership, highlight all existing `featured` flags as editorial selections, or describe working papers, patents, or theses as peer-reviewed journal articles.

## Display and interaction contract

- All visible records are server-rendered, ordered by the existing `date` field in reverse chronological order. Do not substitute `publishDate`, folder-name years, or inferred acceptance dates.
- Within each record, show date/type, linked title, full existing author list, existing abbreviated venue (full venue fallback), and available attachment controls.
- Reuse the theme's author and attachment partials to retain author links, author notes, PDF destinations, citation modal, DOI links, and any future supported attachments.
- Offer a direct BibTeX file link as well as the JavaScript citation modal. The direct file and record links work without the filter script.
- Keep the complete index and year navigation available without JavaScript. Hide filter controls until initialization succeeds; do not replace the records with client-only data fetching.
- Search treats words literally, case-insensitively, across titles, authors, both venue forms, and DOI values. It is not a regular-expression interface. Search, type, and year are combined with AND.
- Derive counts, year groups, and type choices from the built records, not hard-coded totals. Hide empty year groups and their jump links after filtering; announce result counts without moving focus.
- Preserve legacy type fragments, including `#article-journal` and `#working%20paper`. The display slug `working-paper` does not rewrite the source taxonomy value `Working paper`.
- Do not reuse the theme's Isotope container/selectors: this page uses natural document flow and a small independent filter module. Citation-modal behavior remains supplied by the theme.

## Image policy for this slice

The existing 74 featured-image files stay in their original publication bundles and retain their existing detail-page presentation. No image binaries, publication image URLs, or scientific figure captions were edited here. The index deliberately does not shrink complex scientific figures into decorative crops.

Adding a figure to the index is a separate reviewed change. Before doing so, confirm its relationship to the specific publication, rights for reuse, provenance, caption, meaningful alternative text, accessible explanation, and public-release approval. Preserve the complete figure and a link to its source record. Existing publication visibility is not proof that an image is cleared for a new use; do not pull blocked Research figures or private evidence into this index.

## Student update procedure

1. Open a separate branch from the agreed working baseline. Do not push directly to `main`.
2. For an existing publication, open its bundle and compare its title, author order, year, venue, DOI, abstract, and citation with the authoritative publisher/repository source. Record the source and reviewer in the review issue.
3. For a new record, create a new bundle using the existing Hugo publication schema and set `draft: true`. Do not clone another paper's results, author list, figure, DOI, or citation as if they belong to the new work.
4. Resolve disagreements explicitly. Leave uncertain metadata unchanged and flag it for the PI; do not infer a DOI from a URL, retitle a paper, reorder authors, or silently standardize dates. Store a verified DOI as the identifier only (`10.…/…`), without `https://doi.org/`. An HTML conference page belongs in a named custom link, not `doi` or `url_pdf`. Check whether the record is the paper, a cover picture, or a frontispiece before selecting its DOI.
5. Keep existing folder names, slugs, and file paths stable. A required URL change needs an explicit redirect and inbound-link audit.
6. Update `cite.bib` consistently with approved metadata. Check each supplied PDF, DOI, code, dataset, and publisher destination separately; a build cannot verify an external URL's meaning or availability.
7. Add or replace imagery only after the figure review above. Do not automatically reuse figures from other research materials.
8. Run the tests and build below. If editing presentation only, compare with a baseline build and require no differences in publication source bundles.
9. Review the Netlify Deploy Preview at 320 px, 768 px, and a wide viewport. Test long titles/authors, keyboard focus, search paste/clear, all five current types, intersecting filters, zero results, Clear filters, year anchors, legacy type bookmarks, citation opening/copy/download, and direct BibTeX download. Disable JavaScript and confirm all records remain readable.
10. Request PI/content review before changing a draft to public or merging. A successful preview build is not publication approval.

## Repeatable local checks

Use Hugo Extended **0.139.4**, Node.js with `node:test` support, and Python 3. No additional JavaScript or Python test packages are required.

```bash
node --test tests/publications.test.mjs
python -B -m unittest discover -s tests -p 'test_publication_links.py'
publication_build_dir=$(mktemp -d)
HUGO_ENV=production hugo --gc --minify -b https://xushidang-lab.netlify.app/ -d "$publication_build_dir"
python scripts/audit-publications.py "$publication_build_dir"
git diff --check
```

For a presentation-only refactor, build the pre-change version into a separate directory first, then pass that exact directory to `--before`. It accepts the original theme index or the new index:

```bash
python scripts/audit-publications.py "$publication_build_dir" --before /absolute/path/to/baseline-build
```

The comparison checks record order, titles, author text/links, record URLs, attachment controls, and citation file bytes. Also review the source diff: it remains the authority for unchanged metadata, abstracts, figures, and other bundle resources.

The script checks generated HTML, local record/citation destinations, filter labels, initial no-JavaScript visibility, derived groups/types/counts, anchors, script integrity, and DOI-link syntax in the index and every linked publication detail page. It does **not** test rendered layout, browser accessibility behavior, live external URLs, citation accuracy, or scientific validity. The Node DOM-contract fixture is likewise not a browser test.

`--before` is a strict presentation-preservation check: it must fail if intentional metadata or citation corrections are compared with their older versions. For metadata work, document and review each expected difference; do not weaken the baseline check to make the change pass. Use the corrected build as the baseline for the next presentation-only slice.

## Inventory and source-review status

At the baseline, 78 records span 2011–2024: 74 journal articles and one each of working paper, conference paper, thesis, and patent. There are 78 citation files and 74 featured images. These are an inventory of existing records, not a newly verified claim about completeness or scientific status.

Slice 09 identified four DOI-field issues. Slice 10 resolves them as follows; the source evidence and exact scope are in [the DOI audit](publication-link-audit-2026-09-05.md).

| Existing record | Verified record | Applied correction |
| --- | --- | --- |
| Folder beginning `67- Wiley Online Library-2018-Photoacoustic Imaging` | Frontispiece | Use `10.1002/adma.201870214`; retain the underlying research article as a separate named link. |
| Folder beginning `73-Chem Mater-2020-All-in-one molecular AIE theranostics` | Chemistry of Materials article | Normalize `10.1021/acs.chemmater.0c01187`; align the title, venue, first-online date, and citation with publisher-deposited metadata. |
| Folder beginning `76-Small-2016-Cell Tracking Organic Nanoparticles` | Cover picture | Use `10.1002/smll.201670244`; correct reversed citation volume/issue and label the underlying-paper PDF separately. |
| Folder beginning `79-Virtual AIChE Annual Meeting-2020-Physically Informed` | Conference abstract | Remove the non-DOI value and misleading PDF button; link to the verified organizer abstract and include its URL in BibTeX. |

Keep the PR in draft. These four corrections do not certify all 78 records or all external downloads. A subsequent bibliography pass should distinguish cover/frontispiece records from research articles throughout the archive and review remaining venue/date/citation consistency without inventing new records or changing published routes.
