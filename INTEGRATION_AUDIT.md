# ResumeRadar integration audit — 2026-10-07

## A. Architecture and scope

- React/Vite frontend: http://localhost:5173, `frontend/`.
- PDF intake Express server: http://localhost:5000, `backend/pdf-intake/`.
- Verification/analysis Express server: http://localhost:5001, `backend/verification/`.
- SQLite: `backend/verification/resumeradar.db`; unchanged schema and `database.js`.
- Python 3.12.10 is available; matching remains in `semanticMatcher.py`.
- Original repositories, package manifests/lockfiles, CSS, and router/layout remain unchanged. No dependencies reinstalled; no Git initialization, staging, commit, or push.

## B. Before-change runtime evidence

All initial requests included Origin `http://localhost:5173`. The API responses allowed cross-origin requests with `Access-Control-Allow-Origin: *`.

| Request | Status | Actual response / meaning |
|---|---:|---|
| GET :5000/ | 200 | `Candidate Intake API is running!` |
| GET :5001/api/candidates | 200 | `success: true`, two identical demo profiles, no evidence property |
| GET :5001/api/role-analysis | 200 | Data Scientist 93, Full Stack Engineer 74, Frontend Developer 92; combines stored evidence with default scores |
| GET :5001/api/gaps-roadmap | 200 | Two gaps: Node.js / Express (65), Docker & Kubernetes (12); three predefined roadmap steps |
| GET :5001/api/semantic-compare?role=Data%20Scientist | 200 | Four keyword comparisons; score 82, using the stored demo candidate |
| GET :5173/ | 200 | Vite HTML shell |
| POST :5001/api/verify with `{}` | 400 | `No GitHub URL found in profile`; no database write |
| POST :5000/api/resume/upload with `{}` | 500 | `PDF parsing failed`; missing file treated as server failure |

Read-only SQLite inspection found the expected candidates and verification_results tables, 2 candidates, and 10 evidence rows. Existing GitHub result labels/scores match the original helper's hardcoded outage fallback. Duplicate profiles are consistent with Evidence posting on mount under StrictMode. None were deleted.

No production verification POST with a valid candidate was sent. Live Gemini generation was not requested because it could use an external credential/service. These paths were exercised with isolated SQLite and mocked services instead.

## C. Problems and disposition

P0: cannot run. P1: major feature broken. P2: integration issue. P3: minor bug. P4: cleanup/improvement.

| Priority | Problem | Evidence | Root cause | Recommended fix / disposition | Files |
|---|---|---|---|---|---|
| P1 | Upload never extracts or verifies | Simulated filename; button only navigated | No request/state wiring | Fixed: real PDF selection, multipart extraction, existing JSON verification, navigate after success | Upload.jsx |
| P1 | PDF uploads cannot use absent destination | uploads directory absent; cwd-relative destination | Directory never created | Fixed: directory beside relocated server; explicit missing-file and filter errors | pdf-intake/server.js |
| P1 | Evidence overwrites the workflow with demo input | Hardcoded profile posted on mount | Display page performs writes; StrictMode may duplicate them | Fixed: read latest candidate's saved evidence | Evidence.jsx; verification/server.js |
| P1 | Verification reports success before storage | Response outside SQLite callbacks | Asynchronous inserts not awaited | Fixed: await candidate/evidence inserts; errors return failure | verification/server.js |
| P1 | Frontend Developer roadmap crashes | Object receives `.map()` | Other roles use arrays | Fixed: normalize selected milestones to array | Gaps.jsx |
| P1 | Startup can depend on Gemini key even for non-AI APIs | Client created at module scope | Eager client construction | Fixed: initialize inside generation route; clear 503 when key absent | verification/server.js |
| P2 | Saved evidence cannot reach display pages | candidates response had no results | No read contract for verification_results | Fixed additively: each returned candidate includes `evidence`, without removing existing fields | verification/server.js; Evidence.jsx; Dashboard.jsx |
| P2 | Dashboard shows invented profile/metrics on failures | Fixed skills, 24 evidence, logs and fallback scores | Demo state substituted for API errors | Fixed: stored profile/evidence/counts and explicit errors; zero stays zero | Dashboard.jsx |
| P2 | Latest candidate inconsistent on timestamp ties | Existing two rows share created_at | No ID tiebreaker | Fixed: created_at DESC, id DESC in latest-candidate queries | verification/server.js; semanticMatcher.py |
| P2 | GitHub outage manufactures successful evidence | Catch returns named demo projects/scores | Demo fallback masquerades as live verification | Fixed: fail explicitly before storage; empty matches have zero sources | githubVerifier.js |
| P2 | LinkedIn claims independent verification | No LinkedIn HTTP request | Scoring uses supplied URL/experience | Fixed labeling as self-reported; algorithm retained | linkedinVerifier.js; EvidenceDetail.jsx |
| P2 | Python failure returns convincing scores | Node and Python exception fallbacks | Failures hidden by demo output | Fixed: explicit errors; algorithm retained and labeled as keyword matching | verification/server.js; semanticMatcher.py; RoleAnalyzer.jsx |
| P2 | Gemini errors return unlabeled fictional resume | Catch returns fixed skills/projects | Presentation fallback lacks provenance | Preserved fallback with explicit flag/warning; UI displays warning; actual prompt uses candidate name | verification/server.js; RoleAnalyzer.jsx |
| P2 | Candidate-specific fields lost during persistence | SQLite stores only existing name/links/JSON columns | PDF schema contains email/phone/education/research not present in DB | Remains; do not extend schema without an explicit retention decision | resumeParser.js; database.js |
| P2 | Partial rows possible on mid-write failure | Separate inserts, no transaction | Existing DB write model | Response now fails honestly; atomic transaction remains a follow-up | verification/server.js |
| P2 | Previously stored demo evidence lacks provenance | Existing rows have original Verified labels | No provenance columns | Preserved; fresh upload uses corrected flow; old rows must not be treated as genuine verification | existing SQLite data |
| P3 | Gaps fetch hides failures; zero gaps become synthetic gap | Errors logged only; All Systems Verified item | UI/error fallback logic | Fixed error visibility and actual empty gaps | Gaps.jsx; verification/server.js |
| P3 | Selected role passed through shell | exec string interpolates query | Shell execution unnecessary | Fixed: execFile with separate arguments and timeout | verification/server.js |
| P3 | URLs hardcoded to local ports | Inline fetch strings | Existing local-only configuration | Retained intentionally; deploy-time URL configuration is future work | frontend pages |
| P4 | Unwired platform helpers | No imports from server | Standalone/demo helpers | Preserved, not activated; platformVerifier lacks axios import/export | colabVerifier.js; leetcodeVerifier.js; platformVerifier.js |

## D. Actual flow tracing and intended integration

The source supports connecting the existing structured extraction response to verification: both use candidate.profile_links, skills, projects, and experience. Missing certifications are already handled with an empty array. The existing read/analysis APIs use the latest stored candidate, so this integration preserves that model; no new session, server, framework, or database is introduced.

| Flow | Component → endpoint → handler/helper → storage/service → response → rendering |
|---|---|
| Upload Profile | Upload → multipart POST :5000/api/resume/upload → Multer/PDFParse → local uploads/PDF text → structured profile → override links from existing inputs, POST verification, then navigate |
| PDF extraction | Upload → upload handler → PDFParse.getText → resumeParser/regex parser → candidate, education, skills, projects, experience, research → profile sent to verification |
| Research | resumeParser.extractResearch → verifyResearch → Semantic Scholar paper search, limit 1 → verification object inside research → extraction response only; not stored/displayed by verification |
| Candidate verification | Upload → POST :5001/api/verify → GitHub and LinkedIn helpers → candidates + verification_results inserts → success/candidateId/evidence after inserts → Dashboard navigation |
| Evidence | Evidence → GET :5001/api/candidates → read candidates and saved verification rows → parsed evidence/repos array → sorted evidence state → rows/detail panel, no writes |
| Dashboard | Dashboard → candidates + role-analysis + gaps-roadmap → latest DB candidate/results → profile, saved evidence and gap count, role estimate → existing cards populated from these values |
| Gaps | Gaps → gaps-roadmap → latest DB evidence filtered on score <80 or status !=Verified → gaps → cards; learning-roadmap tabs remain predefined frontend content |
| Backend roadmap | gaps-roadmap → three static recommendations → roadmap array → existing Gaps UI does not use this array; this is not a personalized generated roadmap |
| Role analysis | RoleAnalyzer/Dashboard → role-analysis → stored skill scores + existing roleDefinitions/defaultScore → weighted roles → role cards; default estimates now marked explicitly |
| Semantic comparison | RoleAnalyzer → semantic-compare with encoded selected role → execFile Python → local SQLite → weighted keyword score/table or explicit error → comparison table |
| Python matching | semanticMatcher.py → latest candidate skills/projects → predefined role keywords/weights → 95 for a match, 72 otherwise → weighted score; no embeddings or transformer model |
| AI generation | RoleAnalyzer → POST generate-resume with targetRole → latest DB skills/projects/name → lazy Gemini client (gemini-2.5-flash) → generated JSON or explicitly marked demo fallback → resume modal/print |
| SQLite persistence | database.js opens __dirname/resumeradar.db and creates existing tables → awaited insert callbacks → candidates endpoint parses JSON fields and stored repos → shared read flow |
| GitHub | githubVerifier → api.github.com/users/<username>/repos → repository-name groupings → evidence scores/links → SQLite → Evidence/Dashboard; no repository-code, AST, or commit inspection |
| LinkedIn | linkedinVerifier → no external request → supplied URL plus experience/certification counts → self-reported score/status/links → SQLite → Evidence/Dashboard |

Original breaks were Upload → extraction, extraction → verification, persistence → Evidence, and stored metrics → Dashboard. Those connections are now implemented in source. Research and other profile fields remain outside the existing SQLite schema.

## E. Files changed

- backend/pdf-intake/server.js
- backend/verification/server.js
- backend/verification/githubVerifier.js
- backend/verification/linkedinVerifier.js
- backend/verification/semanticMatcher.py
- frontend/src/pages/Upload/Upload.jsx
- frontend/src/pages/Evidence/Evidence.jsx
- frontend/src/pages/Dashboard/Dashboard.jsx
- frontend/src/pages/Gaps/Gaps.jsx
- frontend/src/pages/RoleAnalyzer/RoleAnalyzer.jsx
- frontend/src/components/EvidenceDetail/EvidenceDetail.jsx

Added: `scripts/verify-integration.cjs` and this audit report. Frontend build output was regenerated under ignored `frontend/dist/`.

## F–G. Tests and results

- `npm.cmd --prefix frontend run build`: passed, no errors/warnings.
- Node syntax checks for every JavaScript file in both backends: passed.
- `node scripts/verify-integration.cjs`: passed using in-memory SQLite, isolated ephemeral HTTP servers, a test-owned headless Chromium browser, and mocked GitHub/Gemini. No package installation required.
- Schema initialization tested by evaluating unchanged database.js against in-memory SQLite.
- Request validation, no-candidate states, complete persistence before HTTP success, read response shape, role warning, missing Gemini key, successful mocked generation, labeled Gemini fallback, and shell-free Python arguments: passed.
- GitHub helper network failure and empty-repository cases: passed; no invented sources.
- Real relocated Python executed with -B against a read-only-use local database: passed, keyword method/score 82.
- Real Multer and PDFParse processed a synthetic valid PDF in the browser flow; no real person's resume was used.
- Browser: PDF file selection → extraction → mocked verification → in-memory storage → Dashboard passed. Evidence displayed stored results without a new candidate. Frontend Developer roadmap and Role Analyzer/missing-key error passed. No uncaught browser exceptions.
- Existing production GET endpoints rechecked: all 200 and CORS allowed. Database remained 2 candidates and 10 evidence rows.
- Root ignore patterns tested through Git's read-only check-ignore with the root file as excludes: .env, .db/.db-shm/.db-wal, uploads, dist, node_modules are protected. No Git repo initialized.
- Original source file hashes and all package file hashes checked against the pre-edit snapshot: unchanged.

## H–J. Remaining limits, credentials, next steps

**The currently running Express processes still use their old loaded JavaScript.** The live /api/candidates response still lacks evidence. Restart the existing PDF and verification processes before using the new frontend against them. Python is launched per request, so its changed code is already visible to the old process; this mixed state is another reason to restart. The test suite exercised the new source independently and did not stop/restart the user's processes.

- Start the updated PDF server from backend/pdf-intake using `npm.cmd start` after stopping its old instance. It will create its ignored uploads directory.
- Restart verification from backend/verification with `PORT=5001` (now also the default) and `node server.js`. No Gemini key is needed to start other APIs.
- GEMINI_API_KEY is required for real AI resume generation. No verification .env or configured key was found in the agent shell; the running server's inherited credentials were not inspected or printed. Live Gemini success is unverified.
- GITHUB_TOKEN is optional for public GitHub requests and helps with rate limits. Live GitHub success is unverified; future failures now return errors instead of persisting demo results.
- Python requires no third-party packages. Semantic Scholar currently sends no key. Live Semantic Scholar verification was not invoked; it still treats the first search hit as verification and returns unverified for failed searches/errors.
- Existing role defaults and 95/72 keyword scores are estimates; they are now identified as such. Matching quality was not redesigned.
- Old demo SQLite rows remain. Opening the app cannot turn them into genuine evidence. Use one deliberate real upload after restart to exercise the real services; any data cleanup should be separately authorized.
- Education, email/phone, portfolio, and research persistence require an explicit schema/data-retention decision; no schema change was made.
- Database writes still follow separate inserts; a mid-write failure can leave partial rows. Add transaction handling only as a separately scoped improvement.
- Frontend curated roadmaps and backend three-step recommendations remain predefined. Colab and LeetCode helpers remain unwired.
- No polling, candidate-selection system, deployment URL abstraction, or authentication was added.

The integration is validated with a real PDF parser and browser against isolated handlers. It is not yet a claim of live GitHub/Gemini verification or a complete production product.
