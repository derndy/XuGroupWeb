# Scientific visual governance

Scientific visuals are evidence-bearing content. A file being present in the repository does not make it approved for public use.

## Publication gate

A visual may render on a public Pillar or Project page only when all of the following are recorded:

- stable `asset_id`;
- repository `source_path`;
- public `public_url` for an approved web derivative;
- scientific role: conceptual framework, method diagram, data figure, result figure, or photograph;
- accurate caption and alternative text;
- provenance and versioned evidence source;
- rights or participant-consent status;
- scientific evidence status;
- publication state;
- responsible owner and last review date.

For result-bearing visuals, `rights_status`, `evidence_status`, and `publication_state` must all equal `APPROVED`. The `governed-figure.html` partial makes missing or non-approved metadata a Hugo build error rather than silently publishing the asset.

Conceptual diagrams must state that they are conceptual and must not use styling or captions that imply measured results. Generic AI imagery is not a substitute for a scientific figure.

## Legacy Research images

The files now stored as `audit/legacy-research-assets/2.png` and `audit/legacy-research-assets/4.png` arrived in the initial repository import. Their original component sources, reuse rights, captions, alternative text, and approval history are not recorded. They therefore remain in the repository for traceability but are classified as `BLOCKED / REVIEW_REQUIRED` in `data/research_assets.yml`. Keeping them outside Hugo's `content/` and `static/` trees also prevents them from being copied into the public website output.

## Intake sequence

1. Add or update the asset record in `data/research_assets.yml`.
2. Verify the source file, component provenance, and image dimensions.
3. Write a factual caption and concise alternative text.
4. Record rights or consent and the relevant evidence object or approved conceptual source.
5. Obtain scientific and publication approval.
6. Add the approved `asset_id` to the relevant Pillar or Project visual list; do not duplicate the metadata.
7. Run the production Hugo build and inspect the resulting figure, caption, link, crop, and mobile behaviour.
8. Review the Netlify Deploy Preview before merge.
