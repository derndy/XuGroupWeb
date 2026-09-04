# Xu Lab website

The public website for **Xu Lab — Scientific Learning & Discovery Systems** at South China University of Technology.

## Technology

- Hugo Extended `0.139.4`
- Hugo Blox / Bootstrap module stack
- GitHub source control
- Netlify production and Deploy Preview builds

The Netlify build is defined in `netlify.toml`:

```bash
hugo --gc --minify -b $URL
```

The generated site is written to `public/`.

## Repository map

```text
assets/scss/template.scss     Shared design tokens and site styling
config/_default/              Site, menu, module, and metadata settings
content/_index.md             Homepage metadata
content/research/             Research content
content/person/               Member profiles
content/publication/          Publication records
content/post/                 News records
layouts/                      Custom page templates and partials
static/images/                Public photographs and fixed web assets
static/data/                  Gallery data
```

## Local validation

Install Hugo Extended `0.139.4` and Go, then run:

```bash
hugo server --buildFuture
```

Before opening a pull request, run the production-equivalent build:

```bash
HUGO_ENV=production hugo --gc --minify -b https://xushidang-lab.netlify.app/
```

## Change workflow

1. Create a branch from `main`.
2. Edit content or templates in the appropriate source directory.
3. Run the production build and inspect the generated pages.
4. Push the branch and review the Netlify Deploy Preview.
5. Confirm scientific wording, image rights, responsive behaviour, links, and metadata.
6. Merge only after review. Netlify then publishes from `main`.

Project-specific scientific claims must remain off the public site until their scientific status, evidence status, publication state, and approval are recorded.

## Current redesign

The first redesign slice is maintained on `design/site-foundation-v1`. It establishes the visual system, accessible global shell, semantic homepage, research-pillar overview, evidence loop, testbed framing, recruitment pathway, and a genuine 404 recovery page without altering existing People, Gallery, News, or Publication records.

See [`docs/redesign-foundation.md`](docs/redesign-foundation.md) for the baseline audit and implementation boundaries.
