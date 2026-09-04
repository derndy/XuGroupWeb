# Website redesign foundation

## Baseline

- Repository: `derndy/XuGroupWeb`
- Baseline branch: `main`
- Baseline commit: `b39bb3113f9601433155075204c209672f1758fb`
- Working branch: `design/site-foundation-v1`
- Production base URL in Hugo: `https://xushidang-lab.netlify.app/`
- Netlify build: Hugo Extended `0.139.4`, output directory `public`

## Design thesis

The site is a browsable scientific argument: bold at first sight, systematic on exploration, and rigorous at the evidence layer. Its visual language is editorial, geometric, and evidence-forward rather than a generic AI-themed interface.

The homepage presents one integrated system:

1. design the scientific learner;
2. design the evidence environment;
3. develop the mathematical lens that makes mechanisms identifiable and designs testable.

Molecular interactions, proteins and sequences, biomaterials and delivery, and complex scientific data are treated as cross-pillar testbeds rather than isolated research silos.

## First implementation slice

This branch intentionally changes only the shared foundation and homepage:

- replaces the rotating image carousel with a stable semantic hero;
- adds the approved title, subtitle, and tagline;
- introduces shared colour, typography, spacing, surface, and interaction tokens;
- adds a responsive Space–Interaction–Learning system diagram;
- presents the three research contributions without publishing project-specific claims;
- adds an evidence-loop explanation and testbed framing;
- converts the homepage recruitment block into a focused Join / Collaborate route;
- adds a keyboard skip link;
- removes the invalid SPA fallback and adds a real 404 recovery page;
- aligns GitHub Pages validation with the Netlify Hugo version;
- corrects the sitemap host and repository metadata.

## Preserved content and behaviour

The following areas are deliberately untouched in this slice:

- publication records and citation files;
- person profiles and group photographs;
- gallery data, thumbnails, zoom, rotation, and navigation logic;
- news records;
- contact details;
- the legacy Research page body;
- Netlify project ownership and GitHub connection settings.

## Content governance

Public project copy must be generated only from an approved canonical record. Keep these fields separate:

- scientific status;
- evidence status;
- publication state;
- time horizon;
- access or indexation state;
- owner and last review date.

Conceptual visualisations must never be presented as experimental evidence. Public scientific figures require a caption, alternative text, provenance, rights status, and a named or versioned evidence source.

## Audit findings for later batches

1. `content/research/index.md` remains a long legacy page organised around four application-heavy topics. It needs conversion to the approved three-pillar system.
2. Navigation remains tied to existing live routes. Projects, Resources, and the final grouped Outputs/Updates navigation should be introduced only when those routes contain useful content.
3. People and Gallery use extensive inline styles. Their existing data and behaviour should be preserved while presentation is moved into the shared design system.
4. The Gallery implementation should receive a later accessibility pass for dialog semantics, focus management, button labels, and touch behaviour.
5. GitHub Pages and Netlify both contain deployment workflows. Hugo versions are aligned in this branch, but the long-term single production authority still needs confirmation.
6. The approved conceptual images and scientific SVG maps have not yet been added to this repository.
7. No unapproved Project records, evidence figures, performance claims, or downloads have been exposed.

## Recommended next slices

1. Research landing page and responsive research-system map.
2. Three Pillar page templates and route structure.
3. Curated conceptual image import with responsive derivatives, captions, and alt text.
4. People page visual refactor while preserving profile content.
5. News and Gallery visual refactor with accessible lightbox behaviour.
6. Publications and Resources architecture.
7. Governed Project records and detail pages after scientific approval.

Each slice should receive a production Hugo build, internal-link audit, heading and landmark check, responsive review, and Netlify Deploy Preview review before merge.
