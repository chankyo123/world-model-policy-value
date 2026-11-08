# GitHub Pages migration implementation plan

**Goal:** Publish the existing research page at https://chankyo123.github.io/world-model-policy-value/ with automatic updates from main.
**Architecture:** Keep the React page and audited local research assets; replace the unused managed-hosting scaffold with a Next.js static export. GitHub Actions builds and deploys the export. No server, account sign-in, or external runtime is needed.
**Authorization/spec:** The user chose GitHub Pages, asked for deployment steps, and created the requested public repository. Preserve the approved design and all scientific values; use the V8 poster and direct, positive position wording.

## Review focus
- Assets, fonts and downloads resolve under the repository subpath.
- Mobile layout, chart/policy selectors, both videos and citation copying work.
- Canonical/Open Graph/LinkedIn URLs point to GitHub Pages.
- Public scientific data remain identical; the poster hash matches V8.
- The workflow deploys only validated static output with minimal permissions.

## Tasks
- [x] Convert package/configuration, remove unused hosting scaffold, fix asset paths and metadata, update position/README/poster.
- [x] Add static-export verification and GitHub Actions; build, typecheck and exercise the exported page in desktop/mobile browsers.
- [x] Review the migration, upload to the empty repository, inspect deployment, verify live assets and update the LinkedIn draft.

## Execution notes
Work in the already separate clean release checkout; the original managed-site checkout remains available. Build and browser checks are the relevant verification for this hosting migration. No new experiment or change to numerical results.

Validation: production static build and typecheck pass. Static audit passes for 34 references and 9 artifact hashes. Browser checks pass at 1440, 768, 390, and 320 pixels: no page/request errors or overflow; policy/chart/video switching, video playback, clipboard, mobile navigation, reduced motion, downloads, and metadata verified.

Publication verified: https://chankyo123.github.io/world-model-policy-value/ returns HTTP 200. GitHub Actions run 42512603420 succeeded. The same desktop/mobile interaction suite passes on the public site. Live paper/poster/data/video hashes match the verified export. Independent final review found no blocking or actionable minor issues.
