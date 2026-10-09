# Solara Radio v2.0 — Modernization Roadmap

Status: Planning baseline | Updated: 2026-10-07

## Mission
Modernize Solara Radio without unnecessary wholesale rebuilding: improve code quality, restore Spotify functionality, and align visual design with Radio Atlas. Preserve the existing production site until the replacement is validated.

## Architectural decisions
- Frontend: Netlify, with a Vite-based React build after migration.
- Backend: retain Render and the existing backend where appropriate.
- Avoid a separate Vercel-hosted Spotify component unless a verified requirement warrants it.
- New repository and deployment must be independent of the legacy deployment.
- Keep Solara Radio and Radio Atlas separately deployable while sharing visual conventions.

## Tracking conventions
Story status: Not started / In progress / Blocked / Done. A story is Done only when its acceptance criterion is verified and evidence (PR, screenshot, test output, or deployment URL) is recorded. Estimates are planning aids, not commitments.

## Phase 0: Discovery & Baseline
**Goal:** Inventory the actual application, integrations, infrastructure, and known failures before modifying code.

### SR-0.1: Repository inventory
- **Status:** Not started
- **Story:** Map frontend, Express backend, Netlify functions, packages, routes, widgets, and deploy configs.
- **Acceptance:** Architecture inventory with ownership and dependency diagram.
- **Evidence / notes:** TBD

### SR-0.2: Reproducible local baseline
- **Status:** Not started
- **Story:** Document install commands, runtime versions, build/test results and failures without changing dependencies.
- **Acceptance:** Recorded commands and baseline results.
- **Evidence / notes:** TBD

### SR-0.3: Functional regression inventory
- **Status:** Not started
- **Story:** Catalog routes, widgets, responsive behavior, accessibility gaps and broken links; capture screenshots.
- **Acceptance:** Feature matrix and visual baseline.
- **Evidence / notes:** TBD

### SR-0.4: Spotify failure analysis
- **Status:** Not started
- **Story:** Trace both Spotify implementations, API endpoints, authentication, playlist filtering and iframe messaging; distinguish hypotheses from confirmed failures.
- **Acceptance:** Root-cause report and agreed repair approach.
- **Evidence / notes:** TBD

### SR-0.5: Deployment and secrets inventory
- **Status:** Not started
- **Story:** Identify old repo coupling, Netlify settings, Render services, domains, environment variables, CORS and third-party credentials without recording secret values.
- **Acceptance:** Redeployment checklist and dependency map.
- **Evidence / notes:** TBD

### SR-0.6: Prioritize backlog
- **Status:** Not started
- **Story:** Rank confirmed bugs, risks and modernization work; define release and rollback requirements.
- **Acceptance:** Approved backlog and Phase 0 exit review.
- **Evidence / notes:** TBD

**Phase 0 exit gate:** All required stories have verified acceptance evidence; outstanding risks and deferrals are documented.

## Phase 1: Engineering Foundation & Refactor
**Goal:** Make the codebase easier to understand, test, build, and change while preserving existing functionality.

### SR-1.1: Build tool modernization
- **Status:** Not started
- **Story:** Migrate frontend from Create React App to Vite; align README, Node runtime and lockfile.
- **Acceptance:** Clean install and production build succeed.
- **Evidence / notes:** TBD

### SR-1.2: Quality conventions
- **Status:** Not started
- **Story:** Configure ESLint, Prettier, import conventions and documented scripts.
- **Acceptance:** Lint and format checks run reproducibly.
- **Evidence / notes:** TBD

### SR-1.3: Incremental typing
- **Status:** Not started
- **Story:** Enable TypeScript strict configuration and migrate high-risk services/components first.
- **Acceptance:** Typecheck passes for migrated modules; migration boundaries documented.
- **Evidence / notes:** TBD

### SR-1.4: Feature architecture
- **Status:** Not started
- **Story:** Separate feature modules, shared UI, hooks, API clients, config and domain types.
- **Acceptance:** No functional regressions; clear ownership for each integration.
- **Evidence / notes:** TBD

### SR-1.5: Test foundation
- **Status:** Not started
- **Story:** Replace obsolete starter test; add Vitest, Testing Library and API mocking; cover critical flows.
- **Acceptance:** Automated tests pass on clean checkout.
- **Evidence / notes:** TBD

### SR-1.6: Continuous integration
- **Status:** Not started
- **Story:** Run install, lint, typecheck, test and build on pull requests.
- **Acceptance:** CI blocks failing changes and documents commands.
- **Evidence / notes:** TBD

**Phase 1 exit gate:** All required stories have verified acceptance evidence; outstanding risks and deferrals are documented.

## Phase 2: Spotify Recovery & Reliability
**Goal:** Restore dependable playlist discovery and playback with secure, understandable failure behavior.

### SR-2.1: Define supported experience
- **Status:** Not started
- **Story:** Decide whether embedded playlist browsing alone suffices or authenticated playback is required.
- **Acceptance:** Documented user journeys and feature boundaries.
- **Evidence / notes:** TBD

### SR-2.2: Repair playlist retrieval
- **Status:** Not started
- **Story:** Verify Spotify app credentials, pagination, filters, API response and Render endpoint.
- **Acceptance:** Expected playlists load consistently, including newer collections.
- **Evidence / notes:** TBD

### SR-2.3: Consolidate integrations
- **Status:** Not started
- **Story:** Evaluate removal of the separate Vercel auth/player dependency; keep tokens and secrets off the client.
- **Acceptance:** One documented supported integration path.
- **Evidence / notes:** TBD

### SR-2.4: Resilient playback UI
- **Status:** Not started
- **Story:** Implement loading, empty, error, retry, random selection and open-in-Spotify fallback.
- **Acceptance:** Useful experience when embeds or API calls fail.
- **Evidence / notes:** TBD

### SR-2.5: Spotify regression suite
- **Status:** Not started
- **Story:** Test API contracts, playlist selection, browser restrictions and mobile behavior.
- **Acceptance:** Critical Spotify journeys pass automated and manual checks.
- **Evidence / notes:** TBD

**Phase 2 exit gate:** All required stories have verified acceptance evidence; outstanding risks and deferrals are documented.

## Phase 3: Visual System & UX Refresh
**Goal:** Unify Solara Radio with Radio Atlas visually while preserving Solara’s approachable field-radio personality.

### SR-3.1: Shared visual language
- **Status:** Not started
- **Story:** Define typography, spacing, color tokens, contrast, iconography and reusable component conventions.
- **Acceptance:** Versioned design tokens and accessibility-reviewed palette.
- **Evidence / notes:** TBD

### SR-3.2: Navigation and information architecture
- **Status:** Not started
- **Story:** Group propagation, radio tools, space weather, field resources, music and projects.
- **Acceptance:** All destinations discoverable; broken routes corrected.
- **Evidence / notes:** TBD

### SR-3.3: Widget component system
- **Status:** Not started
- **Story:** Standardize cards, headings, controls, loading/error states and responsive layouts.
- **Acceptance:** Reusable widgets with consistent interaction patterns.
- **Evidence / notes:** TBD

### SR-3.4: Page and hero redesign
- **Status:** Not started
- **Story:** Incorporate updated QSL-inspired illustration, desert/cosmic motifs and links to Radio Atlas.
- **Acceptance:** Approved desktop/mobile visual review.
- **Evidence / notes:** TBD

### SR-3.5: Responsive and accessible UX
- **Status:** Not started
- **Story:** Check keyboard operation, screen-reader labels, color contrast, reduced motion and narrow screens.
- **Acceptance:** No critical accessibility or mobile usability blockers.
- **Evidence / notes:** TBD

**Phase 3 exit gate:** All required stories have verified acceptance evidence; outstanding risks and deferrals are documented.

## Phase 4: Release Hardening & Redeployment
**Goal:** Ship from the modernized repository with repeatable staging validation and a low-risk production cutover.

### SR-4.1: New-repository deployment configuration
- **Status:** Not started
- **Story:** Set up Netlify frontend deployment and Render backend linkage; document environment separation.
- **Acceptance:** Staging deploys independently of legacy repository.
- **Evidence / notes:** TBD

### SR-4.2: API routing and operational checks
- **Status:** Not started
- **Story:** Validate API base URLs, optional /api proxy, CORS, health checks, logs and error reporting.
- **Acceptance:** Cross-origin and routing checks pass in staging.
- **Evidence / notes:** TBD

### SR-4.3: Security and performance review
- **Status:** Not started
- **Story:** Audit dependencies, secrets, caching, bundle size and slow API behavior.
- **Acceptance:** No known release-blocking issues; performance baseline recorded.
- **Evidence / notes:** TBD

### SR-4.4: End-to-end acceptance
- **Status:** Not started
- **Story:** Run critical user journeys, Spotify tests, mobile checks and regression checklist.
- **Acceptance:** All release criteria signed off.
- **Evidence / notes:** TBD

### SR-4.5: Production cutover and rollback
- **Status:** Not started
- **Story:** Confirm DNS/domain plan, publish replacement, smoke-test, monitor and preserve rollback instructions.
- **Acceptance:** New deployment live; rollback path tested/documented.
- **Evidence / notes:** TBD

### SR-4.6: Handover and maintenance
- **Status:** Not started
- **Story:** Update README, operations runbook, integration ownership and follow-on backlog.
- **Acceptance:** Documentation reflects deployed architecture.
- **Evidence / notes:** TBD

**Phase 4 exit gate:** All required stories have verified acceptance evidence; outstanding risks and deferrals are documented.

## Sequencing and dependencies
1. Complete Phase 0 before broad code or design changes.
2. Phase 1 establishes CI and test foundations; Spotify diagnosis from Phase 0 can proceed independently.
3. Phase 2 should restore Spotify before the final UI polish, so real failure states can inform the design.
4. Phase 3 may prototype alongside Phase 2 but should merge after reusable component conventions are established.
5. Phase 4 requires successful staging deployment and end-to-end acceptance before cutover.

## Working log (update at each session)
| Date | Story | Decision / finding | Evidence | Next action |
|---|---|---|---|---|
| 2026-10-07 | Planning | Keep Netlify frontend and Render backend; redeploy from new repo after updates | Conversation decision | Execute Phase 0 baseline checks |

## Open questions
- Which Spotify functionality must remain: playlist embeds only, or user-authenticated playback?
- Which production domain and DNS settings should be retained at cutover?
- Which third-party integrations depend on legacy repo-specific secrets or callback URLs?
- Which Radio Atlas visual tokens are canonical and ready to share?
