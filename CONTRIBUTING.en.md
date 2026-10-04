# Contributing

[简体中文](CONTRIBUTING.md) | **English**

Thanks for wanting to contribute to **MC AI Coding Assistant Tool**. This file explains how to extend rules, data, the MCP Server, and the CLI.

---

## Module overview

| Module | Path | Status | What to contribute |
|------|------|------|----------|
| Forge rules / Skills | `forge/<version>/` | multi-version done (main push 1.20.1) | rules, Skills, scaffold |
| Fabric rules / Skills | `fabric/<version>/` | multi-version done (main push 1.20.1 / 1.21.x) | same as above + Fabric-only Skills |
| NeoForge rules | `neoforge/` | done (main push 1.20.4+) | rules and knowledge |
| Quilt rules (QSL deltas) | `quilt/<version>/` | only the QSL deltas (02–10 read the same-version fabric tree) | QSL registry / events / networking |
| LiteLoader / Rift / ModLoader | `liteloader/` `rift/` `modloader/` | short rule trees (main push 1.12.2 / 1.13.2 / 1.6.4) | short rules, verify tables |
| Bedrock Add-On | `bedrock/` | flat directory (no version splits) | rules, pack validation, Script API |
| Library Skill sources | `knowledge/libs/` | maintained per group (`all-platforms` / `fabric-only` / …) | new library Skills, version mappings |
| Community practice knowledge | `community_knowledge/` | ongoing | publishing / crashes / soft dependencies |
| MCP Server | `mcp-server/` | whatever `list-tools` / the actual registration says | new tools, scripts, tests |
| Offline data | `data/` | 8 platforms, many versions (the surface is whatever `ls data/` says) | fetching, indexing, auditing |
| Root docs | `README.md` / `AUTO_SETUP.md` / `AGENTS.md` / `CONTRIBUTING.md` | ongoing | fixes and sync |

Which platform has which versions, and which one is the main push, is **decided by the "Platforms" table in the root `README.md`** — this section does not repeat it. Verify with `ls -d <platform>/*/` and `ls -d data/*/`.

Knowledge bases and anti-patterns normally live in `knowledge/` under **each platform version directory** (not the repo root).

---

## Adding a new platform or version

### Step 1: copy the directory template

Use a finished version of the same platform as the template (Forge → `forge/1.20.1/`, Fabric → `fabric/1.20.1/`):

```
platform/version/
├── AGENTS.md
├── sync-skills.ps1          # when that platform uses multi-IDE sync
├── .cursor/
│   ├── rules/               # 00–10 .mdc
│   ├── skills/
│   └── agents/
├── .claude/ / .continue/ / .trae/
├── .opencode/ / .agents/ / .zcode/ / .pi/   # OpenCode / Codex / ZCode / Pi (supported on representative versions)
├── scaffold/                # optional: Gradle skeleton
├── code-patterns/           # optional
└── knowledge/               # antipatterns / common / porting / version-changes
```

Community practice knowledge goes in the repo-root `community_knowledge/` (do not duplicate it into `forge/*/knowledge/`). Library Skill sources live in `knowledge/libs/` (see that directory's `README.md`); usage rules are in `community_knowledge/AGENT_USAGE.md`.

### Step 2: change the version-specific fields

- `AGENTS.md`: platform, MC version, Java, mappings, Decision Flow
- `scaffold/gradle.properties` / `build.gradle` / `fabric.mod.json` or `mods.toml`
- the `platform` / `version` / `mappings` values in Skill frontmatter

### Step 3: sync multiple IDEs

After editing `.cursor/`:

```powershell
cd <platform>/<version>
./sync-skills.ps1
```

Or sync every version at once from the repo root (all 8 IDEs):

```powershell
.\scripts\sync-skills.ps1 -All
.\scripts\sync-skills.ps1 -TargetDir .\forge\1.19.4
```

Each version's `sync-skills.ps1` is a thin wrapper over `scripts/sync-skills.ps1`; the root script is the authority.

### Step 4: data and the overview

1. Create the directory under `data/` following the `<platform>_<version>/` convention (the indexed set is not just the three Java platforms: there are also `quilt_*` / `liteloader_*` / `modloader_*` / `rift_*` / `bedrock_stable` / `vanilla_*`; the list is whatever `ls data/` says)
2. Use `mcp-server/scripts/` to fetch and generate L0/L1/L2 + processed
3. Update "Platforms" in the root `README.md` and the routing in `AGENTS.md`
4. `cd mcp-server && set MC_SKILL_DATA=<absolute data path> && npm run audit:data`

---

## Extending existing rules

Every `.mdc` should contain:

1. **Constraints**
2. **Decision Flow**
3. **Example code** (using the mappings that are correct for that version)

Decision Flow format:

```text
### Decision: scenario description

IF condition A
  → approach A

IF condition B
  → approach B

ELSE
  → default, or ask the user
```

Anti-patterns go in `knowledge/antipatterns/` or `09-anti-patterns.mdc`; each entry needs the wrong code, the symptom, the correct approach, and the reason.

---

## Adding a new Skill

Directory: `platform/version/.cursor/skills/<skill-name>/`

```
mc-block/
├── SKILL.md          # required
├── snippets/         # optional
└── README.md         # optional
```

Example metadata at the top of `SKILL.md`:

```yaml
---
platform: forge         # forge / fabric / neoforge
version: "1.20.1"
dependencies: []
mappings: mcp           # mcp / yarn / parchment
---
```

After creating or editing one, you must run `sync-skills.ps1`.

Fabric can additionally carry platform-specific Skills (Fabric API, Kotlin, Cloth Config, and so on).

---

## Official docs and mapping data

### Data layout (schematic)

```
data/
├── forge_1.20.1/
│   ├── forge-docs/<ver>/{raw,processed,index-l0.json,index-l1.json,index-l2.json}
│   ├── mappings/
│   └── extracted/
├── fabric_1.20.1/
│   ├── fabric-docs/<ver>/...
│   ├── fabric-wiki/<ver>/...
│   ├── mappings/          # yarn-*.jar/tiny、yarn-mappings.json、yarn-mappings.sqlite、parchment*、yarn-tiny-provenance.json、upstream/*.bak
│   └── meta.json
└── neoforge_*/
    └── neoforge-docs/...
```

On fabric versions, `yarn-tiny-provenance.json` inside `mappings/` records the provenance of the tiny named-column fix (the sha256 of the upstream v1 backup and of the fixed tiny), and `upstream/*.bak` holds the upstream v1 originals from before the fix. `assert-yarn-named-integrity.mjs` checks both per version for existence and reconciles the hashes; neither may be deleted.

Docs still follow the **L0 → L1 → L2 → L2+ (processed)** layering; you cannot skip a layer.

### Common scripts (all under `mcp-server/scripts/`)

| Area | Example scripts |
|------|----------|
| Forge docs | `fetch-forge-docs.js`, `process-forge-docs.js` |
| Fabric Docs / Wiki / Meta / Mappings | `fetch-fabric-*.js`, `process-fabric-*.js` |
| Parchment / API extraction | `parchment-extractor.js`, and others |
| Yarn SQLite | `npm run build:yarn-sqlite` (recommended; reading the whole JSON at runtime is forbidden) |
| Consistency audit | `npm run audit:data` |

The table is examples, not the full set; **whether a script exists is decided by the disk** (`ls mcp-server/scripts/`).

### Contribution notes

- **Do not** commit `agent-tools/`, `临时文件*.md`, or local audit output into the repo (see `.gitignore`)
- The root `.gitignore` entry `/.cursor/` excludes **only** the repo-root IDE directory. Platform packs such as `fabric/<ver>/.cursor/rules` must be committed (`activate_platform_pack session` only injects rules from there). **Do not** revert them to `.cursor/`, or the new version's rules become invisible to a clone: `rules[]` ends up empty while it still claims "base 00/01/09 loaded"
- **Do not** assume `mcp-server/data/` is the runtime path; MCP reads the repo-root `data/` that `MC_SKILL_DATA` points at
- The ignore rules for large `*.jar` / `*.zip` files are in the root `.gitignore`; the full pack ships as a Release artifact with `SHA256SUMS` + `data-manifest.json`
- When redistributing `data/`, ship [`THIRD_PARTY_NOTICES.md`](./THIRD_PARTY_NOTICES.md) alongside it
- **When adding a new top-level directory / top-level module**: the "managed surfaces" list in the delivery report is the **hand-written list** inside the root `AGENTS.md` §delivery report (currently the 8 platform trees + `data/` / `knowledge/` / `community_knowledge/` / `mcp-server/` / `scripts/` / `agent-tools/` / `openspec/` / `ralphy-spec/` + the root `*.md` files). **A new directory must be added to that list when it lands** (that list is the authority; this section does not restate it), otherwise the round that touches it gets judged as the main-report form and loses the ledger and gate-verification reporting of the maintenance form. How to check: compare `Get-ChildItem -Directory` at the repo root against that list item by item.

---

## Data-chain rules (official standard, ruled 2026-09-12)

This section turns the **rule deviations** recorded item by item in `temp/PLAN-2026-09-08-销账-*.md` into the standard. When a rule and a number conflict, **this section plus the gate's live computation wins**; the old ledger is history only.

### How to read the transclusion markers (`<<<` and `@[code`)

Both of these lines in processed text are **transclusion markers**, not executable code; at read time `mcp-server/src/docs-platform/fabric/transclude.ts` expands them into code blocks. The full shape of `<<<`:

```
<<< @/relative-path[#section-name][{line-selection}][[tab-label]] [other attrs]
```

| Construction | How to read it | Measured count (26.1.2 + 1.21.x) |
|------|------|------|
| `#section-name` | upstream VitePress section import. The marker lines are `// #region name` / `// #endregion name` (the comment prefix follows the language), and **the opening and closing marker lines do not count as body text** | 521 |
| no `#` | a whole-file reference (including `@/public/…`, `@/.github/…`) | 112 |
| `[[Label]]` or a `[Label]` right after | a **tab label**, neither a path nor a section name; strip it from both and keep it only in the provenance comment | 13 |
| `{5-7}` / `{2}` / `{1,3}` | a **1-based closed interval** line selection inside the section (or the whole file when there is no section), comma-separated ranges allowed | 15 |
| non-numeric braces such as `{classtweaker:no-line-numbers}` | **options**: ignore them and emit the whole section (treating them as line numbers makes the entire section disappear) | 3 |
| corpus writes kebab while the blob says snake_case | `regionCandidates()` matches **verbatim** first, then tries the `-`↔`_` variant; 500 verbatim hits ⇒ the variant is a fallback, not the main path | 6 |

- **There is only one criterion**: `parseAngleSpec()` / `angleResolve()` / `pickLines()` are exported by `transclude.ts` and the G3 gate `import`s and reuses them. **Never** write a second "is the section name present" regex inside a gate or a probe — it forked once, and the consequence was that a reader expanded a page successfully while the gate counted it as "not fetched" and skipped the check (13 places).
- The reader's pass condition **accepts both placeholder forms** (`@[code` or a line-leading `<<<`). Accepting only `@[code` makes every page that "uses `<<<` only, on 1.21.4+ and 26.x" emit the placeholder verbatim.

### Counter division of labour (never mix denominators)

| Field | Rule |
|------|------|
| `sites` / `expanded` / `missing` | **counts `@[code` only**. The existing ledger pins it this way: `sites` 3344 marker lines, 669 globally unique targets (`EXPECTED_UNIQUE_TARGETS` in `assert-fabric-transcludes.mjs`), 1672 fully expanded processed pages |
| `angleSites` / `angleMissing` / `angleRegionMiss` | separate fields for `<<<`: marker line count / targets the local mirror cannot reach / targets reached whose section does not line up |
| all placeholders | `sites + angleSites`. To decide "does this page still have unexpanded leftovers" use `hasUnexpandedMarker()`, which recognizes both shapes |
| ownership of expansion correctness | `@[code` belongs to `assert-fabric-transcludes.mjs`, `<<<` belongs to the G3 gate `assert-corpus-faithfulness.mjs`. **The two sets do not overlap**; neither fills in for the other |

- Every count **must state its denominator**. One example with an intermediate name: at S7 it was 355 matching lines / 979 token occurrences (one line with two names counts as 1 line), and after the gate recomputed against today's disk it is **288 matching lines** — both denominators are valid, and only pinning one of them makes regression meaningful ⇒ both the in-gate comments and the ledger field names carry the phrase "matching lines".
- Repo-level counts **exclude `temp/**` wholesale** (no per-name exclusions: there are ≥3 identical copies of the same shape under temp, and volume jitter makes `statSync` results drift).

### Counting rules for the library data chain (two denominators, A and B — never mix them)

- **Counting rule A (`verifiedApi` keys)**: the denominator is the sum of the top-level `"<gameVersion>/<loader>"` keys of each entry's `verifiedApi` in `mcp-server/src/diagnostics/library-catalog.ts`, **measured as 2632** (re-run 2026-09-24); the re-check command is `grep -cE '"[0-9][^"]*/[a-z]+": \{' mcp-server/src/diagnostics/library-catalog.ts`. The same number is pinned as `LEDGER.verifiedApiKeys` in `mcp-server/scripts/assert-lib-ownership.mjs`, and that gate goes red if the disk and the pin disagree. The historical hardcoded values 1880 / 1836 / 1830 are all expired; this rule is authoritative.
- **Counting rule B (the library API summary side)**: the denominator is the file count of `mcp-server/data/lib-api-summaries/*.json` plus the total of their `versions` group keys, **measured as 48 files / 824 groups** (re-run 2026-09-24); the re-check command is `node -e "const fs=require('fs'),p='mcp-server/data/lib-api-summaries';const f=fs.readdirSync(p).filter(x=>x.endsWith('.json'));console.log(f.length,f.reduce((a,x)=>a+Object.keys(JSON.parse(fs.readFileSync(p+'/'+x,'utf8')).versions||{}).length,0))"`.
- **A and B are two different denominators** (2632 ≠ 824); substituting one for the other or mixing them is forbidden. The "7.5 Library mod knowledge system" section of the root `README.md` still shows both figures in place, but **the rule and the re-compute discipline are defined by this section**.

### Ledger, waivers, and debt

- **Numbers may only be recomputed by the gates themselves**: G3 `MC_SKILL_CORPUS_RELEDGER=1` and G4 `MC_SKILL_INDEX_RELEDGER=1` dump and write back; the LEDGER constants for G1/G2 take the measured value printed on the gate's success line. **Docs do not restate counts that will rot**, only the rules.
- **Anything new outside the ledger is red; a ledger entry that stops reproducing is also red** (drain check — G1/G3/G4 all implement bidirectional reconciliation). Debt lists are **emptied, not deleted**: leaving an empty array is zero tolerance, and a recurrence then rings loudly.
- Gates **never delete files**. Leftovers under `data/` (`db.sqlite.old` / `tmp-*`) are only pinned into `DEBT_RESIDUE` and reported on a delete list; deleting belongs to the data owner.
- Every gate clause must **be able to go red from a named poisoning** (the poisons are registered one by one inside `mcp-server/test-scripts.mjs`).

### Verification discipline (added 2026-09-15; all three come from real incidents, not preventive clauses)

- **When you change `mcp-server/scripts/**` or `scripts/**`, closing out must run step 8**: `cd mcp-server && node test-scripts.mjs`.
  Why it is called out separately: the `npm test` chain in `package.json` is long, and a round often only runs a few gates from it (only `assert-lib-ownership` / `lint-skill-verified-api` / `assert-scripts-parse` and the like). On 2026-09-15 it was measured that after such a "partial run" **`test-scripts.mjs` itself was red** (the producer `scripts/build-api-summaries.mjs` had been rewritten while the poisoning anchors in the harness were not synced), yet that round's ledger only recorded the 5 gates it had run ⇒ the ledger could not show that the chain was smoking.
  Step 8 is the gate entry point (`mcp-server/scripts/assert-*.mjs` chained + G1–G4 in full + fake-root poisoning); **it being green is what "no known red in the chain" means**.
  The number of gates is not hardcoded (it grows with iteration); `ls mcp-server/scripts/assert-*.mjs` is the authority.
- **Text anchors and counts hardcoded in the harness must move with the batch, and only in the direction "align the production side first, then change the harness"**.
  `mcp-server/test-scripts.mjs` uses hardcoded values as a **second, independent pin** (for example `已证实包根 47`, and the source-text fragment used for poisoning replacement) — this dual mechanism is deliberate, not redundancy. The cost is that after the production side changes its wording or rules, the harness **fails the assertion on the spot** rather than silently going stale —
  that is the design intent; **do not make it green by deleting assertions**. When syncing, state in a comment "what changed / why this is not a relaxation", and align it with the pinned gate's own `LEDGER` constant (failing to align means real drift, and what needs fixing is the gate ledger, not the harness).
- **Do not run `npm test` concurrently with corpus / doc fetching.** The 4000 ms lag gate in `test-cli.mjs` is coupled to disk load
  (measured: running the forge javadoc fetch and the full chain at the same time made `convert_mapping` produce no stdout within 4000 ms three times ⇒ false red).
  Final acceptance runs and any full-chain run **must have the volume to themselves**.
- **Take gate names from disk, do not copy them from the ledger**: `assert-skill-raw-normalize.mjs` never existed
  (`git log --all --diff-filter=AD` returns zero hits); the real gate is `assert-sync-normalizers.mjs`, already in the chain.
  For the list, see `ls mcp-server/scripts/assert-*.mjs`.
- **When rebuilding the output of `build-api-summaries.mjs`, you must pass `--max-*` explicitly with high enough values**: the script defaults to
  `maxVersions=40 / maxClasses=500 / maxMethods=2000`, while **the artifacts already in the repo were generated with limits far above those defaults**.
  Re-running with the defaults = **silent degradation** (measured on `kotlin-for-forge`: before giving enough, 505 classes / 7 versions dropped / 9 versions skipped at the cap;
  after giving enough, 699 classes / zero truncation). Criterion: the three keys `truncated` / `skippedVersions` / `droppedVersions` in the output
  **appearing at all means this rebuild is incomplete**, and it must not be used to overwrite the old artifact. The lower bounds used in the KFF round are in
  the `LEDGER` comment of `assert-lib-ownership.mjs`.

### Corpus faithfulness invariant

- The raw ↔ processed invariant is **"equal page counts per tree" + a transformation-category ledger** (`identical` / `contentDiff` / `markerOnly` / `fmOnly` / `noTwin`), **not** 1:1 same-name pairing — the latter invents 19747 fake missing entries (the real `noTwin` count is 19565).
- On the neoforge side it is stronger: `processed == stripFrontmatter(raw)` holds byte for byte.
- The generics-loss criterion is: unescape the `&lt;` / `&gt;` entities first, then take the **multiset** of `\b[A-Z]\w*<(?!\/)[^>\n]*>` and compare raw→processed (even a same-count rewrite counts as not surviving).
- Front matter of the upstream mirror is **not modified**: byte faithfulness at the corpus layer outranks local preference.

### Jar identity and `packages` ownership

- The identity segment of a decompilation output directory = **the first 12 hex digits of the sha512 of the jar's bytes** (the filename is not read, and neither is the metadata).
- The `?? "unknown-mod"` fallback was removed: an unresolvable modId is a structured failure `MOD_ID_UNKNOWN`, and it **never** collapses into a shared directory.
- Identity precedence: ① the jar's own metadata → ② **the inner jars it declares itself** (`META-INF/jars|jarjar/*.jar`) → ③ a label supplied by the caller (which must be attested by that jar's own entry paths). The result row's `modIdEvidence` ∈ `jar` / `jarjar-self` / `jarjar-labeled` / `external`. The external-evidence channel is **for the internal batch processor only** and is not part of the MCP tool schema.
- Several jars sharing the same `modId` + `version` is a normal, legal state (JiJ / `.supp` / fork / repack) ⇒ split by content into separate leaves, and the second jar should **succeed**.
- The string `"null"` in `meta.modId` is a legal id; only JSON null, empty, or `unknown*` counts as unknown.
- The `packages` registered in summaries and the catalog are **measured packages**, not an echo of the declared allowlist: declared prefixes are validated against this tree first, and if none hold, it is rebuilt under "modId appears as a path segment (case-insensitive on `-`/`_`)"; when neither holds it is **left empty with a warning** — degrading to "accept everything" is forbidden (an `-all` fat jar would treat the Kotlin stdlib as this library's own API). Ownership is judged **per segment, self-owned** (`ROOT_SEGMENTS=3`) and only rejects "a package root another entry has already attested as its own"; a literal "starts with modId" rule would reject 92.7% of real data.
- `packages` is a **heuristic artifact and must not be used as an import reference**.
- `verifiedApi[key].packageOwnership` has three states ∈ `own` / `bundled` / `unresolved`, produced by `tagPackages()` in `merge-verified-api.mjs`
  (ruled into a standard on 2026-09-13):
  - **Only non-`own` rows need a tag.** Requiring "every row has a tag" literally is a no-op today (`merge --write` adds 0 / overwrites 0 ⇒
    0 tagged rows in the directory); it would need a full retag first. And `own` can already be derived by the rule on the spot, so storing a tag for it **adds no detection power**.
  - **Debt counts only the class "that package root is genuinely attested as owned by another entry"** (the actual harm in F113). Using "contains a modId segment" alone as the debt criterion would mark **866 rows**
    of real data as non-own (GeckoLib's real root is `software.bernie`, KubeJS's is `dev.latvian.mods` — the library name is simply not in the package), drowning the 8 rows of genuine misattribution;
    the remaining non-own rows are visible through the tag and are not counted as debt.
  - `bundled` must carry evidence: it only accepts **bundled pieces the outer jar declares itself** plus the real top-level package roots in that piece's zip entries, and never guesses package names ⇒ early Moonlight versions' `net.mehvahdjukaar.selene` correctly lands as `unresolved` instead of being misattributed as own.
  - A6 must, on top of "new means red", pass drain reconciliation: the catalog's unresolved row set and the ledger are compared **bidirectionally**, and clearing a row requires explicitly deleting it.

### Mapping and version rules

- The rule for an unnamed mapping is `name_named == name_intermediary`; G4 A7 pins `classesNamed` / `unresolvedMethods` / `unresolvedFields` per version. Yarn coverage of 30–36%, `field_*` entries, and `classes named == intermediary` on forge SRG/TSRG eras are all **upstream facts**, not import defects.
- Member-count resolution order is always `meta` → `methods` → `searge_*` (**take, do not sum**); gates and readers share that same order.
- Forge dependency coordinates = the maven **recommended** build, carrying a `forgeVersionSource` provenance field.
- When an audit's premise is not reproducible on disk (for example a JSONL count that no longer exists), **neither keep it as a baseline nor judge the audit false**: acceptance switches to a fixed sample set that is reproducible on disk, and the before/after counts are printed side by side.
- Rule for swallowed exceptions: anything folded into `success` must have its real defect fixed; anything landing as a visible `failed` is closed with evidence — **no waivers, no deferring to the next tier**.
- **`yarn-mappings.sqlite` is reproducible, not a unique copy**: the source `yarn-*-tiny.gz` sits in the same directory and is tracked ⇒ rebuild it per version offline, no network needed:
  `node mcp-server/scripts/_lib/build-yarn-sqlite.mjs data/fabric_<ver>/mappings --version=<ver>` (runnable from the repo root directly: arguments go through `path.resolve`, so both the root and mcp-server as cwd resolve to the same directory). A rebuild carries `schemaVersion` forward
  (measured 3 → 4, adding only single-column indexes on `name_official` / `name_intermediary`), which is a normal migration ⇒ the ledger is recomputed and written back by the gate's `MC_SKILL_INDEX_RELEDGER=1` —
  **never hand-edit the numbers**; before writing back, check that "the only changes are those schema items", because one extra item means it was a data change, not a migration.
- **The named column of `yarn-*-tiny.gz` is a repaired artifact, not the upstream original**: since 2026-09-19 it is rewritten row by row from the upstream v2 jar (the v1 original backup and its sha provenance are in
  each version's `mappings/yarn-tiny-provenance.json` + `mappings/upstream/*.bak`). Re-pulling upstream v1 from maven resets named back to
  `named==intermediary`, which immediately trips the degradation verdict of `assert-yarn-named-integrity`; the self-healing path is to rebuild named first (new pipeline
  `scripts/_lib/repair-yarn-named.mjs` / `npm run build:yarn-named`), then rebuild the sqlite per the previous item.
- **Corruption can look like "the table exists but `COUNT(*)` throws"** (a single bad b-tree page), not like "the table is missing"; the gate's `-1` sentinel must therefore keep being reported separately
  from "missing table". The only way to tell "broken before the commit vs. caused by the copy" is **running the same query on two independent copies and comparing**: on 2026-09-13 it was measured that
  the `methods` of `1.21.8` / `1.21.10` and the `fields` of `1.21.11` errored byte-identically on the failing volume and on its rescued copy ⇒ the committed bytes themselves were bad, unrelated to the copy;
  after rebuilding, every version's `methods` / `fields` / `classes` matches its own `meta` (46592 / 48591 / 49730 and so on), i.e. the content never changed, only the page was bad.

---

## MCP Server contributions

### Tech stack

- TypeScript, Node.js **>= 22.5** (**22.5–22.12 and 23.0–23.3 need `--experimental-sqlite`**; 22.13+ / 23.4+ do not)
- `@modelcontextprotocol/sdk` + `zod`
- package name / Cursor service name: `mc-ai-coding-assistant-tool` / **`MC-AI-Coding-Assistant-Tool`**

### Source layout (summary)

```
mcp-server/
├── src/
│   ├── index.ts                 # entry point, registers the core tools
│   ├── wave/register.ts         # Wave B/C extension tools
│   ├── api/                     # query_api、get_method_params、get_version_info
│   ├── mappings/                # convert_mapping + yarn-sqlite
│   ├── docs-platform/
│   │   ├── forge/ | fabric/ | neoforge/
│   │   └── store.ts             # shared doc storage abstraction
│   ├── porting/                 # analyze_porting_path、port_project
│   ├── datagen/ | crash/ | validate/ | gradle/
│   ├── utils/                   # path、project-sandbox
│   └── workers/
├── scripts/                     # fetch / process / audit / yarn sqlite
├── test-*.mjs
└── dist/                        # npm run build (git-ignored)
```

### Adding a new tool

1. Implement and export it in the matching module
2. Register it in `src/index.ts` or `src/wave/register.ts`
3. Add tests (`npm test`) and honour the `assert-no-yarn-json-slurp` constraints (if Yarn is touched)
4. Update the tool lists in `README.md`, `AUTO_SETUP.md`, and `mcp-server/README.md`
5. When a user string is used as a `Record` key you must use `ownGet` (`src/utils/own-record.ts`); `obj[query]` is forbidden. `constructor` / `toString` once crashed `search_*_docs` and made `get_version_info` treat a Function as a version. Tool boundaries and the version matrix are in the root README's "choose the tool by version" and "tool pitfalls".

### Local development commands

```bash
cd mcp-server
npm ci
npm run build
npm run build:yarn-sqlite
set MC_SKILL_DATA=<repo>/data
npm test
npm run audit:data
npm run smoke:release   # optional
```

Disk-writing tools are off by default; set `MC_SKILL_ALLOW_WRITE` + `MC_SKILL_PROJECT_ROOT` only when testing a real `port_project` write.

---

## Commit convention

Commit messages are written in Chinese, for example:

```
feat(forge/1.20.1): 添加方块实体注册规则
fix(mcp-server): 修正 Yarn sqlite 路径解析
docs(AUTO_SETUP): 同步工具清单与配置草稿流程
chore(data): 忽略临时 plan 文件
docs(fabric/1.21.1): 补充 mixin 反模式
```

---

## Unscheduled list 

This table registers leftover items that are **found, recorded, not owed to anyone, but still waiting for a decision or a slot** — it is **not a TODO list**:

- The `现状` column only answers "what was measured this round (denominator + rule + as-of)"; when something cannot be measured it says `未复核` outright — it is **not** a claim that the item is fixed, and it is **not** an assertion that "upstream / this repo has none".
- The `需要谁拍板` column names the owner: rows marked 「用户」 must not be done by the maintenance side; rows marked 「排期」 have **no gate protecting them** until someone writes a criterion, so the next person will redo the work anyway.
- Division of labour with the ledger: `temp/ralph-20260922/PLAN-STATE-r2.md` (per-round R rows) records "what happened"; this table records "who still owes a decision". Ledger history rows are never revised, so this table is the **only current reading** of the state.
- The relationship with `openspec/` is named in one line in the Chinese table: the `openspec/changes|specs|archive` directories **exist on disk**, while the root `.gitignore:76` says `openspec/` ⇒ zero files in that tree are under management, yet the root `AGENTS.md:410` lists `openspec/**` as a managed surface; that mismatch is one of the registered items.

**Rules for new entries**: keep incrementing `L<n>`, one entry per line, and `现状` must carry a denominator + rule + as-of, or say `未复核` explicitly. **Never** hand over the previous round's status verbatim — that is what lets "a wrong premise survive many rounds" (see `temp/ralph-20260922/round-22-final-sweep.md` §6, item 1).

> **This table is deliberately not duplicated here.** Its 124 rows are ~297 KB in the Chinese file, and their shape is adjudicated by `mcp-server/scripts/assert-backlog-table-shape.mjs` against `CONTRIBUTING.md`. A second English copy of 297 KB would be guaranteed to drift, and would not be checked by any gate.
> ⇒ **Read the rows in [`CONTRIBUTING_LIST.md` §未排期清单](./CONTRIBUTING_LIST.md)**. That section is the single current source; this one states only the semantics and the entry rules.

---

## Questions and discussion

Questions and ideas are welcome as Issues. Read [`AUTO_SETUP.md`](./AUTO_SETUP.md) before configuring the MCP server.
