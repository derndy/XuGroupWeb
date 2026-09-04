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
- Netlify project ownership and GitHub connection settings.

## Second implementation slice

The Research landing page now:

- replaces the four-topic legacy narrative with the approved three-Pillar research system;
- keeps taxonomy, principles, horizons, and testbeds in `data/research_system.yml`;
- renders the asymmetric system map through a reusable partial;
- renders all Pillar modules through one reusable partial;
- distinguishes the scientific learner, evidence environment, and mathematical lens;
- separates NOW, NEXT 3–5 YEARS, and HORIZON statements;
- labels Scientific Learning Grammar as a long-term research horizon rather than a completed theory;
- routes visitors only to existing Publications, People, and Join / Collaborate pages;
- introduces no unapproved Project claims, results, or downloadable artifacts.

## Content governance

Public project copy must be generated only from an approved canonical record. Keep these fields separate:

- scientific status;
- evidence status;
- publication state;
- time horizon;
- access or indexation state;
- owner and last review date.

Conceptual visualisations must never be presented as experimental evidence. Public scientific figures require a caption, alternative text, provenance, rights status, and a named or versioned evidence source.

## Third implementation slice

The first detailed Pillar route now provides the reusable page architecture for Pillar I:

- one canonical data record supplies the landing-page summary and detail-page content;
- the page separates question, responsibility, scope, method families, intended artifacts, testbeds, horizons, and evidence discipline;
- the architecture figure is explicitly labelled as a conceptual framework, not an experimental result;
- optional scientific visuals pass through a build-time metadata and approval gate;
- the two legacy Research images are inventoried as `BLOCKED / REVIEW_REQUIRED` and remain unrendered;
- no project card, performance result, dataset, code artifact, or download has been made public.

## Audit findings for later batches

1. Navigation remains tied to existing live routes. Projects, Resources, and the final grouped Outputs/Updates navigation should be introduced only when those routes contain useful content.
2. People and Gallery use extensive inline styles. Their existing data and behaviour should be preserved while presentation is moved into the shared design system.
3. The Gallery implementation should receive a later accessibility pass for dialog semantics, focus management, button labels, and touch behaviour.
4. GitHub Pages and Netlify both contain deployment workflows. Hugo versions are aligned in this branch, but the long-term single production authority still needs confirmation.
5. Approved scientific images and source SVG maps have not yet been imported. The current maps are responsive semantic web components; legacy PNG files remain blocked pending provenance and rights review.
6. No unapproved Project records, evidence figures, performance claims, or downloads have been exposed.

## Recommended next slices

1. Populate Pillar II through the tested detail-page template.
2. Populate Pillar III through the same template and complete cross-Pillar navigation.
3. Import the first approved scientific visual with responsive derivatives, caption, alt text, provenance, and rights metadata.
4. Refactor the People page presentation while preserving profile content.
5. Refactor News and Gallery presentation, including accessible lightbox behaviour.
6. Build Publications and Resources architecture.
7. Publish governed Project records and detail pages only after scientific approval.

Each slice should receive a production Hugo build, internal-link audit, heading and landmark check, responsive review, and Netlify Deploy Preview review before merge.
