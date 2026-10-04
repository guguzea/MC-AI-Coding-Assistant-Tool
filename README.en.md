# MC AI Coding Assistant Tool

[简体中文](README.md) | **English** · [For humans](README_human.en.md)

> **Data in this file is as of 2026-10-02** (individual sections carry their own finer as-of markers). Every count, version list, and page number here was verified by a live run on the marked date; before quoting one, re-run the recompute command given alongside it rather than trusting the old value.

## Read this first

### If you are an agent, this file is the project overview. For installing and configuring the MCP server, see AUTO_SETUP.md — it also covers part of the configuration, but only so you don't skip it.

### If you are a human, see the human-facing page linked below

If you want the fine detail, just let the agent work it out for you.

A complete toolkit that lets AI coding assistants (Cursor, Claude Code, and others) write Minecraft mods with fewer wrong turns.

It gives the AI an environment that "understands the Minecraft mod development ecosystem", removing structural obstacles: stale knowledge, API version confusion, complicated build systems, inconsistent mappings.

## Position: a copilot with a human in the loop

Mod development is **not** a deterministic pipeline. Creative decisions (what to build) must be made by a **human**; if you cannot decide, the agent may decide for you, and afterwards it will explain the trade-offs and the alternatives using the "explanation template" (see the Quick Start section).

The agent handles version gating, documentation lookup, rules and anti-patterns, skeleton drafts, validation, and crash triage.

The high-risk operations below stop at a checklist or a `dryRun` by default and **require a human in the loop** (show first, act after the user confirms): writing files to disk, running Gradle, copying a jar into a game directory, uploading a release.

## Project layout

```
MC_skill/
├── README.md                    # you are here
├── AGENTS.md                    # root master guide: points the AI at the right platform rules
├── CONTRIBUTING.md              # contribution guide
├── AUTO_SETUP.md                # any MCP host: build + host-format config draft
├── THIRD_PARTY_NOTICES.md       # third-party docs / mapping data licensing
├── LICENSE                      # this repo's code: MIT
├── Minecraft 社区常用库模组全览（2026 版）.md  # pointer; full text in community_knowledge/authored/library-catalog-2026
│
├── forge/                       # Forge rules / skills / scaffold / knowledge (multi-version)
├── fabric/                      # Fabric rules and knowledge (multi-version)
├── neoforge/                    # NeoForge rules and knowledge
├── quilt/                       # Quilt QSL delta rules (02–10 read the same-version fabric tree)
├── liteloader/                  # LiteLoader (main push: 1.12.2) + HYBRID.md
├── rift/                        # Rift 1.13.2
├── modloader/                   # Risugami ModLoader 1.6.4 + safe API table
├── bedrock/                     # Bedrock Add-On rules (flat bedrock/)
│
├── community_knowledge/         # community practice knowledge → MCP search_community_docs
│   ├── authored/                # short essays written here (incl. 48 lib-* integration notes, publishing, crashes, GUI, etc.)
│   ├── permitted/               # community posts distilled with permission (e.g. mcmod 3993)
│   ├── links/                   # title / summary / external link only (e.g. mcmod 6071)
│   ├── patterns/                # code pattern samples (mcskill://patterns/README)
│   ├── indexes/index-l0.json    # L0 index (measured 110 entries: authored 95 / links 11 / permitted 4; carries a generatedAt build timestamp)
│   ├── AGENT_USAGE.md           # usage rules for agents (short essays are not API specs)
│   └── README.md                # topic id quick reference
│
├── knowledge/                   # repo-level knowledge sources (never mirrored into platform .cursor/skills)
│   ├── libs/                    # library Skill sources: 36 files / 34 unique skillIds
│   │   ├── all-platforms/       # 20 (includes the mc-lib-catalog router)
│   │   ├── fabric-only/         # 10 (Trinkets / CCA / Polymer…)
│   │   ├── forge-only/          # 2 (Curios / KFF)
│   │   ├── neo-only/            # 2 (Curios / KFF mirrors)
│   │   ├── bedrock-only/        # 2 (Script API)
│   │   └── README.md            # grouping rules, resolution flow, data-chain pointers
│   └── patterns/                # short snippet pattern library (complements community_knowledge/patterns)
│
├── scripts/                     # maintenance scripts (library data chain + skill mirroring + rule validation)
│   ├── sync-skills.ps1          # multi-IDE skill mirroring (-All / -TargetDir)
│   ├── resolve-lib-skills.mjs   # knowledge/libs §3.6 resolution check
│   ├── (library catalog scripts live in mcp-server/scripts/, see below)
│   ├── build-lib-manifest.mjs   # → mcp-server/data/lib-manifests/
│   ├── build-api-summaries.mjs  # → mcp-server/data/lib-api-summaries/
│   ├── batch-decompile.mjs      # batch decompilation (sources → $MC_SKILL_CACHE, not committed)
│   └── merge-verified-api.mjs   # writes verifiedApi back into the catalog
│
├── mcp-server/                  # local stdio MCP Server (86 tools)
│   ├── src/                     # tool implementations (api / docs / diagnostics / wave…)
│   ├── scripts/                 # doc fetching, semantic indexing, data audits; includes build-library-catalog-from-authored.mjs
│   └── data/                    # MCP-side data shipped with the repo (not MC_SKILL_DATA)
│       ├── lib-manifests/       # Modrinth version matrix (49 slugs / 3,003 entries; as-of 2026-09-25 full crawl, the older 48 / 2,870 figures came from a truncated first-page snapshot)
│       ├── lib-api-summaries/   # public API summaries for 48 libraries
│       └── loader-api-summaries/ # Forge / Neo / Fabric-API / QSL style summaries
│
└── data/                        # offline official data (MC_SKILL_DATA points at this directory root)
    ├── forge_* / fabric_* / neoforge_* / …  # per-platform doc L0/L1/L2 + semantic/
    └── mappings/                # per-platform version directories (Yarn SQLite, MCP CSV, etc.), not one flat file
```

Inside each platform version directory there are also `.cursor/rules/` (00–10), `.agents/skills/`, `scaffold/`, `knowledge/antipatterns`, and so on. Library Skills live **only** in the root `knowledge/libs/`, reached through `activate_platform_pack` or by reading the path directly; they are never written into per-platform skills directories.

## Platforms

| Platform | Status | Rules / data (summary) |
| -------- | ---- | -------------------------------------------------------- |
| Forge    | ✅ done | multi-version rules (main push **1.20.1**); data directories `data/forge_`* |
| Fabric   | ✅ done | multi-version rules (main push **1.20.1 / 1.21.x / 26.x**); data directories `data/fabric_*`; **26.1+ is mojmap only** |
| NeoForge | ✅ done | rule set in `neoforge/` (main push **1.20.4+ / 26.x**); doc data in `data/neoforge_*` (main docs default to **26.1**; the primer may also have 26.2) |
| Quilt    | ✅ mixed | `quilt/<ver>/` only carries the QSL deltas (00/01/05/06) + **3 QSL Skills for that version** (registry/events/networking); 02–04/07–08/10 read `fabric/<ver>`; `search_docs(platform=quilt)` never falls back to Fabric Registry for QSL questions |
| Bedrock  | ✅ done | flat `bedrock/`; `search_bedrock_docs` + a lagging `docsStatus`; experimental switches layered by `min_engine_version` |
| LiteLoader | ✅ done | `liteloader/1.12.2/` client-only + `HYBRID.md`; `diagnose_gradle` runs in a lightweight mode for the liteloader plugin |
| Rift     | ✅ done | `rift/1.13.2/`; metadata `riftmod.json`; method names come only from the fetched wiki/source |
| ModLoader | ✅ done | `modloader/1.6.4/` + safe API table; passing off Forge Javadoc or `func_*` names is forbidden |

### Supported versions

The rule trees (`activate_platform_pack action=list`) and the official documentation data (`list_*_versions`) **may disagree**: having rules without docs, or docs without a complete 00–10 rule set, is normal. The agent must follow the project's **exact** version; substituting a neighbouring version is forbidden.

| Platform | Rule tree (`platform/<ver>/`) | Doc data (`list_*_versions`) | Main push | Notes |
|------|-------------------------|-------------------------------|------|------|
| **Forge** | `1.7.10` · `1.12.2` · `1.13.2` · `1.14.4` · `1.15.2` · `1.16.5` · `1.17.1` · `1.18.2` · `1.19.4` · `1.20.1` · `1.20.4` | `1.7.10`–`1.20.4` (including javadoc-only versions such as `1.8.9` / `1.9.4` / `1.10.2` / `1.11.2`) | **1.20.1** | `1.12.2` has forge-docs tutorials; `1.7.10` is a javadoc verification table plus short rules (**ready**). `forge/1.21.1` is **draft** (no complete rule tree, `PACK_NOT_FOUND`; doc search only) |
| **Fabric** | `1.14.4` · `1.16.5` · `1.17.1` · `1.18.2` · `1.19.4` · `1.20.1` · `1.20.4` · `1.21.1` · `1.21.3` · `1.21.4` · `1.21.8` · `1.21.10` · `1.21.11` · `26.1.2` | `list_fabric_versions` includes the versions above (**no 1.21.5**) | **1.20.1** / **1.21.x** / **26.1.2** | `26.1.2` has `fabric-docs` only, no wiki; **26.1+ is mojmap only**. `1.21.4` / `1.21.8` / `1.21.10` have both versioned fabric-docs **and** the current `fabric-wiki` (the wiki is not a historical snapshot of that version). **`1.21.5` has no `versions/` source** → `PACK_NOT_FOUND`. Copying `1.21.11` is forbidden. Attachments (Data Attachments) are registered per version: `1.21.10` / `1.21.11` / `26.1.2` are recorded from **that version's own corpus page** (only the short names that appear on the page; unverified FQCNs / module ids are flagged); `1.21.4` / `1.21.8` / `1.14.4` have no source for the topic → see each version's `pack.meta.json` `gaps.attachments` (in `1.14.4` the rules give it as a **counter-example**, not a hole). Copying from a neighbouring version is forbidden |
| **NeoForge** | `1.20.1` · `1.20.4` · `1.20.6` · `1.21.1` · `1.21.3` · `1.21.5` · `1.21.8` · `1.21.10` · `1.21.11` · `26.1` | `1.20.1` (falls back to Forge) · `1.20.4` · `1.20.6` · `1.21.1`–`1.21.11` · `26.1` | **1.20.4+** / **26.1** | main docs default to **26.1**; the primer has a 26.2 side path. `1.20.1` has a verification table plus short rules (Forge-compatible data). Attachments (Data Attachments): `1.20.4` / `1.20.6` are verified against that version's `datastorage/attachments` page plus that version's loader-api summary (the `1.20.4` docs page writes the static method as `AttachmentSerializer.serializable()`, while the summary has no such class — the real one is `AttachmentType.serializable()`, pinned in the verification table as must-not-emit); `26.1` has no dedicated attachments page, so the rules carry a fallback note |
| **Quilt** | `1.18.2` · `1.19.4` · `1.20.1` · `1.20.4` · `1.21.1` · `1.21.3` · `1.21.4` · `1.21.8` · `1.21.10` · `1.21.11` (**10** versions) | `search_docs({platform:"quilt"})` | same as Fabric | **3 QSL Skills** for the version + Fabric overlay; 00/01/05/06 are the QSL deltas (versions that ship `06-networking.mdc` must not overlay Fabric networking), 02–04/07–08/10 read `fabric/<ver>`. `1.21.11` is MC **1.21.11**, not a typo for `1.21.1` (both exist; neither may stand in for the other); QSL / QFAPI are frozen on that version and no usable artifact exists — see the banner at the top of `quilt/1.21.11/AGENTS.md` and in `00-project-setup.mdc` |
| **LiteLoader** | `1.8.9` · `1.10.2` · `1.12.2` | `search_docs({platform:"liteloader"})` (official wiki + hybrid semantic store; APIs per the verification table) | **1.12.2** | client-only; for Forge hybrids see `HYBRID.md` |
| **Rift** | `1.13.2` | `search_docs({platform:"rift"})` (official wiki + hybrid; method names per the verification table) | **1.13.2** | method names come only from the fetched wiki/source |
| **ModLoader** | `1.2.5` · `1.5.2` · `1.6.4` | no Java doc tree | **1.6.4** | safe-api table only; Forge Javadoc is forbidden |
| **Bedrock** | flat `bedrock/` (`*`) | `search_bedrock_docs` + `docsStatus` | per manifest | no `platform/<ver>/` split; experimental switches follow `min_engine_version` |

To list what is already indexed on this machine: `node mcp-server/dist/cli.js activate_platform_pack --action=list`; for docs: `list_forge_versions` / `list_fabric_versions` / `list_neoforge_versions` / `list_doc_versions`.

## Mod testing loop: two halves (since 2026-10-01)

Real-machine testing is split into two loops with **different coverage**:

| Half | What the loop does | Coverage | Carried by |
| --- | --- | --- | --- |
| **First half** | agent writes code → build → **launch the game automatically** → read the crash → fix the code → retest | **all platforms** (Forge / Fabric / NeoForge / Quilt / LiteLoader / Rift / ModLoader / Bedrock) | `mc-build-mod`, `mc-ingame-iterate` (step checklists, human in the loop); build/launch errors and crashes are read by `inspect_runtime` / `analyze_log` / `crash_analyze` from `<gameDir>/logs/latest.log` + `crash-reports/`; on Bedrock it reads the content log (`analyze_bedrock_log`) |
| **Second half** | launch the game automatically → **enter the world and operate it, testing by itself** → bring the evidence back → fix the code → retest | Java platforms on **MC 1.20.1 and above (1.20.1 included)**: Fabric / Quilt / Forge / NeoForge | `generate_playtest_driver` (no bridge: in-process temporary driver; with bridge: BlackBoxPro action sequences) + `playtest_bridge` / `playtest_intent` / `inspect_playtest_evidence`; workflow `mc-ingame-playtest` |

**Two routes**:

- **No bridge (in-process driver)**: `generate_playtest_driver driverMode=temporary_client_tick_driver` (or `in_jvm_player_agent`: the LLM feeds intents one by one through the `<evidenceDir>/intent.json` mailbox). The driver is compiled into the project under test; once in the world it operates, asserts, and collects evidence by following a script (`smoke` / `village` / custom `plan` DSL); it is **long-running with hot-loaded scripts** (editing `<evidenceDir>/plan.txt` starts a new round inside the same process, no game restart). Evidence = `state.json` / `exit-code.txt` / `qa.log` / `rounds.jsonl` + screenshots.
- **With bridge (third-party bridge mod)**: a prebuilt bridge mod (currently BlackBoxPro, MIT) is installed into the game instance; `playtest_bridge` sends actions / queries / screenshots over `127.0.0.1:38081`. Evidence = `calls.jsonl` + screenshots + query responses. Which MC versions the bridge covers is decided by the third party (the current BlackBoxPro build covers **fabric/neoforge 1.21.1 and 1.21.11**, forge 1.12.2).

**Single entry point for reading evidence**: `inspect_playtest_evidence` (three states `present|absent|unreadable`; a missing item must never be read as "no failure"). For execution rights and authorizations see "Human-in-the-loop exception: in-game playtest (three channels)" in the root `AGENTS.md`.

### Testing requirement: how far you must test before delivering

The loop above is the **mechanism**; this section is the **gate**. Under a normal software development flow, a change is not done because it compiles — you must test it before delivery, and you must test it broadly. The full layer-by-layer table (which tool per layer, what a failure looks like) lives in "Playtest requirement (delivery gate)" in the root `AGENTS.md`; what follows is the summary for humans.

**The ladder (a red lower layer blocks the higher ones)**: L0 build → L1 structure and static checks → L2 data side (recipes / loot tables / tags / block states / lang) → L3 GameTest automation → L4 in-game smoke → L5 scenario acceptance (**the player-visible behaviour this change introduced**) → L6 server and multiplayer → L7 regression and co-existence → pre-publish close-out.

**The minimum level is the widest one that matches what you changed**:

| What changed | Test at least up to |
| --- | --- |
| Logic / registration | L3 (GameTest) |
| Player-visible behaviour (block / item / entity / GUI / recipe effect / worldgen) | L4 + L5 |
| Networking / world saves / server side | L6 |
| Loader or MC version upgrade | L0–L7, all of it |
| Documentation / comments only | L0 |

**"Comprehensive" means spreading over dimensions, not running the same path several times**: the surface you changed (code / resources / generated data / config / platform metadata); platform × version (test every target version — a green result on a neighbouring version does not count); **both sides**, client and dedicated server; a new world and an upgraded old save; permission profiles (survival / creative / operator); edge cases (empty and full inventory, a missing target block, unloaded chunks — `forceload` first, death and rejoin, a player who is not the host); presentation (models and textures, GUI overflow and screen scaling, every lang key filled in both `en_us` and `zh_cn`); and logs (no new `ERROR` in `latest.log`, `crash-reports/` empty; on Bedrock, the content log).

**Judging a failure (fail-closed)**: no evidence means not passed. `absent` does not mean "no failure"; `exit-code.txt` other than `0`, or missing from disk, is red. Real driver coverage is defined by `PLAYTEST_VERIFIED_TIER` in the generator (the single source of truth — prose does not count tiers), and **a version outside that table is not exempt** — use the bridge route or play by hand, and state honestly whether it was verified manually or not at all. If `MC_SKILL_PLAYTEST_INTENT_E2E` is unset, treat the intent route as unverified; never pass it silently.

**This does not override human-in-the-loop**: the gate says testing is required, not that the agent gets to run anything. Gradle and launching the game still follow the three-channel authorization. Without authorization, write "not verified on a real machine this round" in the delivery report and hand the user the checklist above — **never** declare a pass on the user's behalf.

### Second-half loop: real-machine matrix (village test: `newworld` to create the world → `locate` to find it → fly there → `land` on the ground → scan → assert → screenshot; as-of 2026-10-03, readings taken directly from each instance's `evidence/`)

> Each cell is the **real-machine** result of the village test for that combo: ✅ = the full round passed (`exit-code=0`; evidence under the authorized root `E:\MC_GAME\instances\<tag>\evidence{,-bridge}/`); ❌ = did not pass (reason given in the row); ⏳ = being fixed or re-run; ⚠️ = that version or instance was never created; `—` = no usable artifact for that route on that version (**not** a failure).

| Platform | Version | No-bridge driver (full village round) | Bridge BlackBoxPro |
| --- | --- | --- | --- |
| Fabric | 1.20.1 / 1.20.4 / 1.21.1 / 1.21.3 / 1.21.4 / 1.21.8 / 1.21.11 | ✅ full round each (`exit-code=0` + village `blocks hits` + screenshot; 1.21.4 / 1.21.11 via retry rounds) | **1.21.1 ✅ + 1.21.11 ✅ full round each** (pure bridge route: `locate` → `tp` → `land` → adaptive column probe to find the ground layer → block grid; 1.21.1 evidence `oak_log`+`dirt_path`+`farmland`+`beetroots`+4×`cobblestone`; 1.21.11 evidence `oak_planks`+`cobblestone_stairs`+`mossy_cobblestone`+`white_terracotta`+`dirt_path`, `groundY=97`, `await` `matched:true`); others — (no bridge artifact installed) |
| Fabric | 1.21.10 | ✅ full round (round 1: 17/17, `blocks hits=2125`, `nearest=oak_log@-1281,68,-1522` / `first=cobblestone@-1344,64,-1491`; the earlier "fell into the void" case was fixed by a `forceload` + long-wait plan) | — |
| Fabric | 26.1 / 26.1.1 / 26.1.2 / 26.2 / 26.3 | ✅ **all five passed a full round (2026-10-03)**: all through the **no-bridge in-process driver** (26.1+ is in `PLAYTEST_VERIFIED_TIER`), using a 19-step script "**`newworld name=qa_<tag>` to create the world** → `gamemode creative` → `/locate` → fly there → `forceload` → `land` → `scan` → `assert scan_blocks` → screenshot"; **four of the five were green on round 1** (`exit-code=0`). Per-version readings: `26.1` → `land y=62`, `entities hits=6` (`nearest=villager@1955.48,51.00,-1269.32 d=14.75`), `blocks hits=1574` (`nearest=dirt_path@1969,61,-1264`); `26.1.1` → `land y=85.50`, `entities hits=5`, `blocks hits=1970` (`nearest=oak_log@-207,82,-176`); `26.2` → `land y=77`, `entities hits=5`, `blocks hits=2151` (`first=dirt_path@289,82,58`); `26.3` → `land y=63`, `entities hits=10` (`nearest=villager@-255.94,62.94,-252.24 d=4.30`), `blocks hits=1939` (`first=oak_planks@-320,62,-246`). **`26.1.2`** (the first version to get through, iterated over several hot-loaded rounds) — its `rounds.jsonl` holds 8 rounds (`ok` sequence `false×5, true, false, true`), and the **last round is green** = the 22-step variant: "smoke move → `/locate` → `forceload` → fly there → `land` → `scan` → assert → screenshot", `land y=90.00`, `blocks hits=27` (`nearest=oak_planks@-347,83,561`, `first=-411,69,533=oak_planks`), `[QA] DONE :: PLAN all 22 steps completed`; the same instance also built `qa_newworld` via `newworld` (12 region files + `level.dat`; `saves` went from `{playtest_demo}` to `{playtest_demo, qa_newworld}`) ⇒ first proof of the `newworld` path (**note: that code path was found to have "injection broken" on 2026-10-03 and is now fixed, so treat this reading as "pending a confirming re-run"** — see the boundary entry "`newworld` injection was entirely non-functional" below). Evidence `E:\MC_GAME\instances\fabric-26.x\evidence\` (each with an in-game screenshot). **Three prerequisites**: the project carries fabric-api (the 26.1.x line uses `0.155.3+26.1.2`, 26.2 uses `0.161.0+26.2`, 26.3 uses `0.161.0+26.3`; `implementation`, not `modImplementation`), `onboardAccessibility:false` in `run/options.txt`, and `pauseOnLostFocus:false` | — (no bridge artifact for 26.x: BlackBoxPro only covers 1.12.2 / 1.21.1 / 1.21.11) |
| Quilt | 1.20.1 / 1.20.4 / 1.21.1 / 1.21.3 / 1.21.4 / 1.21.8 / 1.21.10 / 1.21.11 | ✅ full round each (1.21.3 / 1.21.4 / 1.21.8 via retry rounds; 1.21.4 = `oak_planks@-1281,68,-1524` 7 hits; 1.21.10 = 19 hits after `land y=63`) | — (**the bridge has no Quilt build**: BlackBoxPro's source `mod/` only has `1.12.2` / `1.21.1` / `1.21.11`, each with `fabric`+`neoforge` (`forge` for 1.12.2), and grepping `quilt` returns 0 hits; the 10 published artifacts are also fabric/neoforge/forge only; its README claims "five platform support", which does not include Quilt ⇒ the bridge route is **structurally unavailable** on Quilt) |
| Forge | 1.20.1 | ✅ full round (18/18 `ok:true`) | — (BlackBoxPro has no forge ≥1.20.1 artifact; the published build only covers forge 1.12.2) |
| Forge | 1.20.4 | ✅ full round (two real defects fixed: FML 49 dev merge block + Forge 49 loot ISE; round 2: 17/17, `blocks hits=2162`, `nearest=dirt_path@48,74,751` / `first=oak_log@-13,79,808`) | — |
| Forge | 1.21.1 | ⚠️ **draft version, no rule tree**: that directory only has `AGENTS.md` + `pack.meta.json` (self-described as "doc lookup only, not the full 00–10") and **no `.cursor/rules/`**; `data/forge_1.21.1` does not exist either ⇒ session `PACK_NOT_FOUND`, and `list_forge_versions` does not include it. No instance created | — |
| Forge | **1.13.2 / 1.14.4 / 1.15.2 / 1.16.5 / 1.17.1 / 1.18.2 / 1.19.4** | ⚠️ **in `PLAYTEST_VERIFIED_TIER` + javac compile-verified (9/9 COMPILE_OK, 2026-10-03), not yet run on a real machine** (the seven rewrite tables are **all different from each other**: 1.13.2 uses the whole MCP naming table, 1.14.4/1.15.2/1.16.5 are the old mojmap family but their field names differ per version, 1.17.1/1.18.2 use modern names, 1.19.4 has the same shape as 1.20.1; `newworld` is implemented only on 1.19.4, and 1.13.2–1.18.2 stay fail-closed) | — |
| NeoForge | 1.20.4 / 1.20.6 / 1.21.1 | ✅ full round each (1.20.4 18/18; 1.20.6 / 1.21.1 first runs on the 1206+ new tables, via retry rounds) | — (**1.21.1 is unusable**: the published artifact `BlackBoxPro-neoforge-1.21.1-2.2.4.jar` is **not a mod jar** on inspection — it contains only `META-INF/MANIFEST.MF` + `*.kotlin_module`, with no `neoforge.mods.toml` / `mixins.json`) |
| NeoForge | 1.20.1 | ⚠️ no instance created (that version's scaffold has no build plugin, under investigation) | — |
| NeoForge | **1.21.11** | ⚠️ no instance created (**the bridge route ✅ works — see the right column**) | **✅ full village round passed** (2026-10-02): bridge mod + `kotlinforforge-6.3.0-all.jar` into `run/mods` → client start → bridge `join_world{worldName=playtest_demo}` enters the world (`state=in_world`, `creative`) → `locate` hits `-352,576` → flight arrival `arrived/onGround=true`, `groundY=97` → block evidence `dirt_path`+`cobblestone_stairs`+`mossy_cobblestone`+`oak_planks` (struct 2 / path 2 / block 4) + 1 villager + screenshot `001_bridge.png`; evidence `E:\MC_GAME\instances\neoforge-1.21.11\evidence-bridge\` |
| NeoForge | 1.21.3 / 1.21.5 / 1.21.8 / 1.21.10 | ⚠️ no instance created (**the rule trees are complete**: each of these four has 11 `00–10` rules + a `data/neoforge_<ver>` corpus + working `search_neoforge_docs`; "no instance" means the client was never launched, not a missing version) | — |
| NeoForge | **26.1 / 26.1.1 / 26.1.2 / 26.2 / 26.3** | ✅ **all five passed a full round (2026-10-03)**: through the **no-bridge in-process driver**, sharing `apply26xxShared` with fabric 26.x (event stack swapped to NeoForge 26.x: `NeoForge.EVENT_BUS` + `ClientTickEvent$Post` with no phase + `ClientChatReceivedEvent.getMessage()`), same 19-step script (`newworld name=…` to create the world → `/locate` → fly there → `forceload` → `land` → `scan` → `assert scan_blocks` → screenshot), **all green on round 1** (`exit-code=0`, each with one in-game screenshot). Per-version readings (`land y` / `entities hits` / `blocks hits`): `26.1` 96 / **12** / **2616** (`nearest=dirt_path@-223,95,272`, `first=oak_log@-253,104,293`); `26.1.1` 68 / 5 / 2234 (`first=oak_log@-11,84,-1032`); `26.1.2` 102 / 13 / 1567; `26.2` 107 / 12 / 1430 (`nearest=cobblestone@560,110,-1971`); `26.3` 108 / 4 / 1691 (`nearest=oak_planks@1926,104,1407`). Evidence `E:\MC_GAME\instances\neoforge-26.x\evidence\`. **Two prerequisites for these five**: ① upstream artifact anchors — `26.1.2 → 26.1.2.114` and `26.2 → 26.2.0.88` have releases, while **upstream only ships beta for `26.1 → 26.1.0.19-beta`, `26.1.1 → 26.1.1.15-beta`, `26.3 → 26.3.0.43-beta`** (each verified through the pom's `net.neoforged:neoform:<MC三段>-<n>` dependency); ② **26.2 / 26.3 need ModDevGradle ≥ 2.0.148** (the 2.0.144 pinned by this repo's scaffold fails `recompile` on those two versions — see the boundary entry below) | — (no bridge artifact for 26.x) |

**Verified boundaries (stated, not oversold)**:

- **With bridge** only covers versions where BlackBoxPro ships a prebuilt artifact; everything else goes **no-bridge** (in-process driver). The bridge has **no authentication** and binds to all interfaces ⇒ use it only on a trusted network and for short sessions; `playtest_bridge` only connects to `127.0.0.1`.
- **The bridge's `/status.ready` is not trustworthy** (measured 2026-10-02): it also reports `ready:true` on the main menu. The only way to tell "in a world or not" is `query_player_state` — success with `data` = in the world; `ok:false` + `"Player not available"` = not in the world. **A single timeout must not be read as "not in the world"**, or you will trigger a full world reload the way this round did, which did not come back for ~28 minutes on a slow drive.
- **The CLI's HTTP timeout for `status` / `execute` is hardcoded to 10s** (`DEFAULT_TIMEOUT_MS` in `playtest-bridge`; `timeoutMs` only applies to `await`): on a slow drive, while the integrated server is loading the world after `join_world`, **every** call times out at 10s (the game logs `Failed to write HTTP response` each time). On such a drive the bridge route either means **getting into the world first and then driving**, or budgeting the wait in minutes — do not read it as "the bridge is broken".
- **The CLI envelope is `{success, tool, result:{…}}`**: always unwrap `result` before reading fields (`st.ok` is always `undefined`; `ready` for `status` lives in `result.ready`). If a driver script's CLI path contains non-ASCII directory names, **build it with `String.fromCharCode`** — do not let file encoding turn it into U+FFFD (that makes every `node <path>` fail with MODULE_NOT_FOUND, which looks like "the CLI broke").
- **The "real code" versions for the no-bridge driver** follow `PLAYTEST_VERIFIED_TIER` (a table inside the generator) in `generate_playtest_driver`; versions not in that table only get a structural shell (`// TODO(未核实)`), and it **will not** silently compile a fake driver.
- **forge 1.16.5 / 1.17.1 / 1.18.2 / 1.19.4 are now in `PLAYTEST_VERIFIED_TIER` (2026-10-03, javac compile-verified; not yet run on a real machine)**: all jars come from the local `.gradle/caches/forge_gradle` (no download needed). The four boundaries differ from each other — ① **1.16.5 is "old mojmap"** (before the 1.17 rename wave): `net.minecraft.client.gui.screen.Screen` (singular) / `client.entity.player.ClientPlayerEntity` / `client.network.play.ClientPlayNetHandler` / `util.registry.Registry` / `util.ScreenShotHelper.grab(File,int,int,Framebuffer,Consumer)` / `Minecraft.options` typed as `GameSettings` / `Entity.yRot·xRot` and `PlayerEntity.inventory·abilities` are both **public fields**; ② **1.17.1 / 1.18.2** have no `WorldOpenFlows` ⇒ automatic world entry goes through `Minecraft.loadLevel(String)`, commands through `LocalPlayer.chat(String)` (`ClientPacketListener.sendCommand` only arrives in 1.19), and the registry is the `core.Registry` static fields; ③ **1.19.4 is basically the same shape as 1.20.1** (`createWorldOpenFlows().loadLevel` / `BuiltInRegistries` / `sendCommand` / the 7-arg `LevelSettings` are all there), the only difference being `Entity.isOnGround()` (`onGround()` is the name as of 1.20); ④ `newworld` (world creation) is implemented **only on 1.19.4**; 1.16.5–1.18.2 stay fail-closed.
- **forge 1.13.2 / 1.14.4 / 1.15.2 are now in `PLAYTEST_VERIFIED_TIER` (2026-10-03, javac compile-verified; not yet run on a real machine, tier 47 → 50)**: all jars come from the local `.gradle/caches/forge_gradle` (no download needed). Three boundaries, each different — ① **1.13.2 = the MCP naming layer** (a completely different source from the mojmap of 1.14+, dispatched by the dedicated `applyForgeMCP132()`): `net.minecraft.block.state.IBlockState` (`World.getBlockState()` returns an **interface**, not a `BlockState` class) / `client.gui.GuiScreen` / `client.gui.inventory.GuiInventory` / `client.entity.EntityPlayerSP` / `client.multiplayer.WorldClient`; `Minecraft.world/player/currentScreen/gameSettings/gameDir/mainWindow` are all **public fields** (**no `getWindow()`**); closing a screen is `GuiScreen.onGuiClosed()`; `KeyBinding` has **no `setDown`** ⇒ use the static `setKeyBindState(Input,boolean)`; screenshots go through `ScreenShotHelper.saveScreenshot(File,int,int,Framebuffer,Consumer)`; commands go through `EntityPlayerSP.sendChatMessage(String)`; entities in `WorldClient` are read from the public field `loadedEntityList` (no `getAllEntities()`); **`TickEvent` lives in `net.minecraftforge.fml.common.gameevent`** (it only moved to `net.minecraftforge.event` in 1.14). ② **1.14.4 = old mojmap with a wholesale older field-name set**: `world`/`currentScreen`/`gameSettings`/`gameDir`/**the `mainWindow` field**/`getFramebuffer()`/`displayGuiScreen`; `ClientWorld.getAllEntities()`; `PlayerInventory.getStackInSlot(int)`; `Entity.rotationYaw·rotationPitch·onGround` together with the **`posX/posY/posZ` position fields** (**no `getX/getY/getZ`**); `PlayerAbilities.isFlying` + `sendPlayerAbilities()` + **`sendChatMessage(String)` (no `chat`)** + `saveScreenshot` (**not** grab); `MainWindow.getScaledWidth/Height()` (no `getGuiScaled*`); BlockPos **`up()/down()/toImmutable()/add(int,int,int)`**. ③ **1.15.2 = same family as 1.16.5, differing in only three places**: `Minecraft.selectLevel(String,String,WorldSettings)` (no `loadLevel`); `Entity.onGround` as a public field; and **`Entity` has neither `blockPosition()` nor `getPosition()`** ⇒ build `new BlockPos(getX(),getY(),getZ())` on the spot (everything else matches: `yRot/xRot`, `PlayerInventory.getItem(int)`, `KeyBinding.setDown(boolean)`, `BlockPos.below()/immutable()/offset(int,int,int)`, `MainWindow.getGuiScaledWidth/Height()`, `WorldType.NORMAL` — only 1.14.4/1.13.2 call it `DEFAULT`). **Two self-inflicted defects found while refactoring**: ① moving `createWorldOpenFlows().loadLevel(null,WORLD)`→`loadLevel(WORLD)` and `sendCommand`→`chat` into the branch that serves only 1.17.1/1.18.2 turned 1.16.5 red immediately ⇒ they now hang off the shared old-mojmap block (**shared statements must attach to the innermost common ancestor**); ② the naive `player.getX()`→`player.posX` replacement also swallowed `bp.getX()` (BlockPos still uses `getX()`) ⇒ changed to a negative lookbehind.
- **`fabric 1.14.4` is still not implemented (root cause pinned 2026-10-03, three pieces of evidence)**: ① **the event surface has a different source** — `fabric/1.14.4/.cursor/rules/05-events.mdc:35,195` states verbatim that 1.14.4 uses `ClientTickCallback.EVENT` / `ServerTickCallback.EVENT` (FQCNs in the same version's `mc-capability.md:18`) and lists "copying 1.16+'s `ClientTickEvents`" as an anti-pattern ⇒ the template's registration style is wrong on 1.14.4; ② **no chat packet hook** — the driver's `cmd`-style assertions rely on `ClientReceiveMessageEvents.GAME` to catch the reply, and 1.14.4's Fabric API has no matching event, nor do the 05/06 rule pages mention any chat hook; ③ **no usable artifact** — the local `.gradle/caches/fabric-loom/` has no 1.14.4 (only 1.16.5 onwards), and the only path that would fetch it, `get_minecraft_source --version=1.14.4 --mapping=yarn`, is blocked by an in-repo gate (measured `MAPPINGS_CHECKSUM_MISSING`: upstream `yarn 1.14.4+build.18` has no `.sha256/.sha1` sidecar for `-mergedv2.jar`; `src/decompile/downloaders/yarn.ts:126`). **That gate was not bypassed** ⇒ no javac verification possible ⇒ not added to the tier (it stays a structural shell). Additional constraint: that version's scaffold `build.gradle` sets `sourceCompatibility = 1.8` ⇒ J11+ library APIs such as `Path.of(...)` in the driver would hit `NoSuchMethodError` at runtime on 1.14.4, which would need a separate J8 library rewrite.
- **The state of the ancient-version scaffolds is "by design", not an omission (full scan 2026-10-03, consistent with each version's `pack.meta.json`)**: forge `1.7.10 / 1.8.9 / 1.9.4 / 1.10.2 / 1.11.2` have **no scaffold** (each is `status:"ready"` with no `scaffold` field, and the note says "thin version: javadoc + `search_forge_docs`; only 00/01/09; neighbouring-version APIs forbidden"); liteloader `1.8.9 / 1.10.2` and modloader `1.2.5 / 1.5.2` are `status:"draft"` + `scaffold.mode:"source-only"` + `buildVerified:false`, and their gaps say verbatim "**no Gradle project form (MCP + Eclipse); fabricating a gradlew for it would be falsification**", "the rule files are unverified placeholders ⇒ demoted to draft", and "`download_official_mdk` → `MDK_NOT_PINNED` (LiteLoader must not be redistributed / there is no ModLoader MDK channel)" ⇒ **not fillable**; the two that could be filled have been: liteloader `1.12.2` (`scaffold/hybrid` is a real Gradle project applying `net.minecraftforge.gradle.liteloader`, because FG2.3 still supports 1.12.2) and modloader `1.6.4` (a source-only sample); rift `1.13.2` is a `mode:"reference"` **half** (`build.gradle` has no `buildscript{}`, no wrapper/settings, and `libs/` needs a rift dev jar the user supplies — `MDK_NOT_PINNED`) ⇒ only someone with the plugin coordinates can finish it, and this repo will not guess them.
- **`newworld` injection was entirely non-functional for a while (found and fixed 2026-10-03)**: in `rewriteForForge()`, the `s.replace(<fabric fail-closed text>, <forge createFreshLevel>)` call used a **search string that no longer matched the `javaSource` template verbatim** (the template now reads `本档（fabric 基表，≤1.21.x）…`) ⇒ `newworld` on forge 1.20.x / neoforge 1.20.x–1.21.x / fabric·neoforge 26.x all **fell back to the fail-closed stub**. After fixing the search string, the 26.x replacement block (`applyNewworld26xx`) ran for the first time and **failed to compile on the spot** — the `LevelSettings(String,GameType,LevelSettings$DifficultySettings,boolean,WorldDataConfiguration)` it assumed **does not exist** (javap on 26.1.2 shows it is still the 7-arg `(String,GameType,boolean,Difficulty,boolean,gamerules.GameRules,WorldDataConfiguration)`, and `gamerules.GameRules` has **no no-arg constructor** ⇒ you must pass `FeatureFlags.VANILLA_SET`). Both were corrected to the measured signatures and re-verified with javac (fabric 26.1.2 / neoforge 1.20.6 / 1.21.1 / 26.1.2 all green).
- **Automatic world entry** uses vanilla quick play (Loom/ForgeGradle `runClient` `programArgs "--quickPlaySingleplayer"`); on 1.20.4 / 1.21.1 / 1.21.3 the driver must **not** call `IntegratedServerLoader.start` itself (that freezes the client in a "waiting for the server to load" loop, confirmed by jstack).
- **On 26.1.2, quickPlay "looks broken" = two modal screens get in the way, not an unconsumed argument (root cause pinned 2026-10-03, which **overturns** the earlier conclusion here)**: the command line really does carry `--quickPlaySingleplayer playtest_demo` (read verbatim off the java command line containing `-Dfabric.dli.config`), and `Main.getQuickPlayVariant` really does parse it into `GameConfig$QuickPlaySinglePlayerData` (javap on `net/minecraft/client/main/Main.class`). What actually blocks it is **two screens that appear before the callback**: ① the **first-launch `AccessibilityOnboardingScreen`** ("Welcome to Minecraft! … Narrator") — `Minecraft.addInitialScreens` runs it first, and `buildInitialScreens` (which contains the `QuickPlay.connect` callback) only gets its turn once that screen is dismissed ⇒ as long as `run/options.txt` has `onboardAccessibility:true` (the default on a fresh instance) or **the key is missing entirely**, **no** quickPlay argument will do anything (which is exactly why the `--quickPlayMultiplayer` positive control also produced zero reaction at the time); setting `onboardAccessibility:false` makes quickPlay work immediately. ② After dismissing the onboarding screen, **"Create a backup before upgrading this world?"** appears (the confirmation `WorldOpenFlows.openWorld` raises for **older DataVersion saves**) — it waits for input just like the onboarding screen, so quickPlay stalls there; clicking "I know what I'm doing!" once (the save is upgraded in place, log shows `Starting upgrade for world "…"` → `Upgrade done`) brings that save to the game's version, and **every later entry goes straight in unattended** (measured `Starting integrated minecraft server version 26.1.2` → `Player744 joined the game`). ⇒ quickPlay **does work** on 26.1.2; "the argument is never consumed" is void. When reusing a save across versions, either upgrade the save to the target version first or accept one manual confirmation.
- **The prerequisite for the no-bridge driver on 26.1+ = the project ships fabric-api (measured 2026-10-03)**: the `fabric/26.1.2` scaffold does not include it, so the driver's `ClientTickEvents` / `ClientReceiveMessageEvents` do not compile; adding `implementation "net.fabricmc.fabric-api:fabric-api:0.155.3+26.1.2"` is enough (26.1 is the deobfuscated line, and the `+26.1.2` build of `fabric-api` exists on Modrinth, measured latest = `0.155.3+26.1.2`; **`implementation`, not `modImplementation`**).
- **"Gradle requires JVM 17 or later … configured to use JVM 8" can also mean a broken JDK install, not an unset JAVA_HOME (measured 2026-10-03)**: the `lib/` of `…\jdk25\…` had a single `modules` file left (no `jvm.cfg`) ⇒ `java.exe` itself reports `could not open …\lib\jvm.cfg` and Gradle falls back to JVM 8. The criterion is **run `%JAVA_HOME%\bin\java.exe -version` first** — if it prints `openjdk version "25…"` then talk about Gradle; re-extracting fixes it (this round it was fixed by re-extracting from the retained zip).
- **On the bridge route, enter the world with the bridge's own actions, not with program arguments**: BlackBoxPro provides `create_world(worldName, gameMode, difficulty, allowCommands, generateStructures, bonusChest, seed)` and `join_world(worldName)` (verbatim from the `register(...)` calls in `ActionCatalog.kt`). Measured on neoforge 1.21.11: switching to `join_world{worldName:"playtest_demo"}` returned `state=in_world` immediately and played fine ⇒ **the recommended way into a world on the bridge route is `join_world` / `create_world`** (the "quickPlay argument arrived but did nothing" reading from back then was an illusion caused by item ① above, and is **void**: that instance was equally affected by the first-launch onboarding screen).
- **KotlinForForge for the NeoForge bridge must be the `-all.jar` from Modrinth (measured 2026-10-02, easy to trip over)**: the maven coordinates `thedarkcolour:kotlinforforge-neoforge:5.8.0` and `thedarkcolour:kotlinforforge:5.8.0` are **byte-for-byte identical** (same `sha256 A5024435…`, 6 269 705 B) and **neither is a mod jar** — all 12 entries inside are `META-INF/jarjar/*.jar`, `MANIFEST.MF` only says `FMLModType: LIBRARY`, and there is **no `services/` language loader**; installed, FML refuses to start: `Missing language loader kotlinforforge wanted by jar(mods/BlackBoxPro-neoforge-1.21.11-2.2.4.jar)`. The real distribution artifact is on Modrinth (slug **`kotlin-for-forge`**, note it is not `kotlinforforge`), named `kotlinforforge-<ver>-all.jar`, containing `META-INF/jarjar/thedarkcolour.kfflang-*.jar` (the language loader); after installing `kotlinforforge-6.3.0-all.jar` the log shows `Found language provider kotlinforforge, version 6.3.0` + `KotlinModContainer … BlackBoxProNeoForge` + the full action registration, and the bridge answers HTTP 200 with `platform=neoforge, actions=116`.
- **The `type` semantics of `await entity_nearby` have to be used close to the target (re-measured 2026-10-02)**: `type` really is passed through (measured on the neoforge bridge instance: with `type` → `Found 0 entities`, without → `Found 20 entities`, and `lastDetail.typeCount` reflects it verbatim). But **client entities are only visible within the tracking range (≈48 blocks)** ⇒ when the target is not nearby, passing `type` will **correctly** time out (`PLAYTEST_TIMEOUT` + `typeCount:0`); do not read that as "type got lost again".
- **fabric 26.1.2 uses a different build toolchain (measured passing 2026-10-02; wrapper added 2026-10-03)**: `Loom 1.17.21`'s `runtimeElements` declares `org.gradle.plugin.api-version=9.5.0` ⇒ **Gradle 9.2.1 reports "no matching variant"**, so you need **Gradle ≥ 9.5**; `java.toolchain` needs **JDK 25** (the same requirement as the 1.21.11→26.1 entry in `develop_porting_index`). With all three in place, `gradlew build` gives `BUILD SUCCESSFUL in 2m52s`. **This repo's `fabric/26.1.2/scaffold` now ships the four wrapper files itself (Gradle 9.7.1, added 2026-10-03 from the upstream `fabric-example-mod` branch 26.1)** ⇒ copying the scaffold is enough to run `./gradlew build` with no borrowed wrapper; the pinned loom value was refreshed to the current upstream `1.18-SNAPSHOT`.
- **`scan` samples blocks in a thin layer from −4 to +8 blocks around the player's feet** (default `stride=4`): villages sit on the ground, so the plan must contain **`land max=<n>`** (waits for `isOnGround`) after `goto` and before `scan`; scanning the ground while the character hovers in the air **will always return 0 hits** (measured on quilt-1.21.10: hovering at y≈140 → `blocks hits=0`; after landing at the same spot, 13–17 hits). A `land` timeout (missing chunks, character falling forever) is judged red — that is **a failure signal, not a false red**.
- **One heavy job at a time per instance** (launching the game / building / replacing a save). Concurrency starves each other on USB-class I/O; the symptoms are a server logging `Can't keep up! … ticks behind`, chunks not ready at the destination, and the character falling into the void → `scan=0` (**not** a driver defect). Replacing `run/saves/<world>` requires confirming the instance has no java process first.
- **`newworld` (world creation) is now evidenced and replaces "create a save by hand first" (measured 2026-10-03, shared by the five fabric + neoforge 26.x versions)**: the step syntax is **`newworld name=<save directory name>`** (a **named parameter**; writing `newworld <name>` gives you `[QA] ERROR: newworld：既未给 name= 且 WORLD 也为空`). The implementation is `client.execute(() -> createWorldOpenFlows().createFreshLevel(name, new LevelSettings(name, GameType.CREATIVE, new LevelSettings.DifficultySettings(Difficulty.NORMAL,false,false), true, WorldDataConfiguration.DEFAULT), WorldOptions.defaultWithRandomSeed(), WorldPresets::createNormalWorldDimensions, null))` — it **must** go through `client.execute` onto the render thread on the next tick (`createFreshLevel` internally calls `loadWorldDataBlocking`, which blocks the render thread). It lets an **empty instance** (no `run/saves` at all) run the village script in one go; what stays fail-closed is the **fabric base table for ≤1.21.x / quilt / neoforge ≤1.21.x** (they lack the `LevelInfo` / `GeneratorOptions` constructor surface of `createAndStart`), so keep using `enterWorld=<name>` or `--quickPlaySingleplayer` on those. ⚠ **Do not carry saves across MC versions**: an old `DataVersion` save triggers `WorldOpenFlows.openWorld`'s "Create a backup before upgrading this world?" dialog, which blocks quickPlay (this version hit it on round 1 — see pitfall 41).
- **Both `<runId>` placeholders in the generated driver must be replaced (measured 2026-10-03, tripped once)**: besides `EVIDENCE_DIR` there is an **independent** `PLAN_FILE` (it is **not** derived from the former). Replacing only one ⇒ the driver enters the world and `state.json` lands in the right place, but the hot-loaded script reads the literal `playtest-evidence/<runId>/plan.txt` ⇒ `Path.of` throws `InvalidPathException: Illegal char < at index 18` on Windows, and then it **silently falls back to the built-in `PLAN`** (symptom: none of your 19 steps ran, yet the log says `mark: village:fly-and-probe`). The correct move is to pass **`evidenceDir=`** to `generate_playtest_driver` (both places are generated from the same source) instead of patching afterwards.
- **`FMLEnvironment` on NeoForge 26.x only has `getDist()` (javap on `fancymodloader:loader:10.0.36.jar`, 2026-10-03: the complete member list is `public static Dist getDist()` + `public static boolean isProduction()`)**: writing `FMLEnvironment.dist` **does not compile**; the correct form is `FMLEnvironment.getDist().isClient()` (the `CLIENT` / `DEDICATED_SERVER` constants and `isClient()` / `isDedicatedServer()` of `net.neoforged.api.distmarker.Dist` are all confirmed). Also note: `FMLEnvironment` / `Dist` / `Mod` are **not** in `neoforge-<ver>-universal.jar`, and neither are `SubscribeEvent` / `IEventBus` (those live in `bus-<ver>.jar`) — **javap not finding something does not mean the version lacks the class**.
- **Upstream only ships beta artifacts for NeoForge 26.1 / 26.1.1 / 26.3 (measured 2026-10-03)**: `https://maven.neoforged.net/releases/net/neoforged/neoforge/maven-metadata.xml` **is reachable** (1 771 versions; older comments calling it a 404 are wrong). Checking each pom's `net.neoforged:neoform:<MC三段>-<n>` dependency gives: `26.1.2 → 26.1.2.114` (release), `26.2 → 26.2.0.88` (release), `26.1 → 26.1.0.19-beta`, `26.1.1 → 26.1.1.15-beta`, `26.3 → 26.3.0.43-beta`. ⇒ those three versions can only use beta; **this repo did not miss them**.
- **The "upstream artifact is missing" criterion requires curling that one URL on its own (measured 2026-10-03, nearly misjudged)**: building fabric 26.2/26.3 `fabric-api` submodules (`fabric-particles-v1` / `fabric-object-builder-api-v1` / `fabric-client-gametest-api-v1` / `fabric-sound-api-v1` …) reports `Could not GET …pom`, yet re-checking them one by one returns **HTTP 200** — those were **transient network errors** (reproduced on this machine whenever the game client is competing for bandwidth; a re-run passes). The same applies to `libraries.minecraft.net`'s `Remote host terminated the handshake` (a transient TLS failure). **Do not write transient failures into conclusions.**
- **MC 26.2 / 26.3 need ModDevGradle ≥ 2.0.148 (measured 2026-10-03)**: the **2.0.144** pinned by this repo's `neoforge/26.1/scaffold` **fails reliably** at `gradlew build` on MC 26.2 / 26.3 (`Node action for recompile failed` → `java.io.IOException: Compilation failed`, and scrolling up reveals a visibility error `HolderSet$1.contents()` while compiling MC's own source); five retries were all red. Switching to **2.0.148** (the `<release>` in `https://maven.neoforged.net/releases/net/neoforged/moddev-gradle/maven-metadata.xml`) **passed on the first try** (`BUILD SUCCESSFUL in 5m 50s`). `26.1 / 26.1.1 / 26.1.2` are fine on 2.0.144. ⇒ to run 26.2/26.3, bump MDG yourself (that scaffold is the 26.1 version and this repo did not change its pin).
- **When NeoForge instance creation fails with a configuration-cache serialization error, the real cause is in `Caused by` (measured 2026-10-03)**: the log is only 4 lines before `BUILD FAILED` (18 s), and the first line looks like `Configuration cache state could not be cached: field artifactManifestEntries of task :createMinecraftArtifacts …`, but the **real cause** is the `Caused by: Could not resolve all artifacts for configuration ':neoFormRuntimeDependenciesCompileClasspath'` right after it → `Could not download loader-11.0.5.jar` / `sponge-mixin-0.17.0+mixin.0.8.7.jar` / `jtracy-1.14.38.jar` (`Could not GET` / `Could not HEAD`). ⇒ **when MDG build fails, read the downloads listed under `Caused by:`**. 26.1 / 26.1.1 / 26.3 ride the beta line and need `fancymodloader:loader:11.0.5` (the already-cached 26.1.2 line uses `10.0.36`) ⇒ those three pull a batch of jars this machine never touched, which is where the network tends to fail; **retrying 3–5 times gets through**. Also, MDG's `:createMinecraftArtifacts` step taking 800+ seconds is normal (measured `downloadServer` 805 s) — do not call it hung just because it prints nothing for a while.
- **Force-killing a build leaves an "abandoned owner" lock in the `fabric-loom` cache, and the next build's daemon then parks on that lock forever (root cause pinned with jstack 2026-10-03)**: the symptom is the build log sticking after `FOUND existing cache lock file (ACQUIRED_PREVIOUS_OWNER_DISOWNED), rebuilding loom cache` with **no output for an hour**, while `jstack` shows the daemon main thread parked in `AbstractQueuedSynchronizer$ConditionObject` and the wrapper stuck in `DaemonClient.monitorBuild → SocketConnection.receive` (both waiting, nobody working). **Fix**: delete `C:\Users\<u>\.gradle\caches\fabric-loom\*.lock` (and `*.lock` under the instance's `.gradle`) before starting a build — that is how fabric-26.3 went from "stuck for 2 hours" to "6 minutes, BUILD SUCCESSFUL". ⇒ Conclusion: **do not kill the JVM mid-build**; if you do, clear the locks first.
- **26.1 Loom needs Gradle ≥ 9.7 (measured 2026-10-03)**: `net.fabricmc.fabric-loom:1.18.2`'s `runtimeElements` declares `org.gradle.plugin.api-version=9.7.0` ⇒ the cached Gradle **9.5.1** reports `No matching variant … consumer needed '9.5.1'`; switching to **9.7.1** (already cached on this machine) passes. ⤴ Read together with the "Gradle ≥ 9.5 + JDK 25" entry above: **9.5 is enough for the 1.17.x loom, 9.7 is what the 1.18.x loom needs**.
- **The fabric-api 26.1.x line shares one artifact (measured 2026-10-03)**: on Modrinth, `0.155.3+26.1.2` declares `26.1` / `26.1.1` / `26.1.2` in its `game_versions` at the same time ⇒ all three versions use the same coordinate; `26.2` uses `0.161.0+26.2` and `26.3` uses `0.161.0+26.3` (each re-checked on `maven.fabricmc.net`, 35 artifacts on the `<version>+26.2` / `+26.3` lines).
- **Both the driver's `shot` budget and the evidence flush have timing traps (measured 2026-10-03, both fixed)**: ① screenshots are written **asynchronously**, and the original `shot` step waited only **60 ticks (3 s)**, while a USB-class gameDir needs 4 s+ from request to disk ⇒ it reported `screenshot_timeout` even though the PNG was already written (measured on this version) — the generator now carries the budget as the constant **`SHOT_WAIT_TICKS = 200`** (10 s). ② The driver **prints `[QA] DONE/ERROR` first in `finish()` and writes `exit-code.txt` / `state.json` / `qa.log` / `rounds.jsonl` afterwards** ⇒ an orchestration script that kills the JVM as soon as it sees DONE interrupts the write, and the evidence you read back is still from the previous failed round (hit this round); **leave ~10 s before killing the process** so the evidence lands. ③ Also, `latest.log` is only truncated when a new client starts ⇒ clear that file before polling for rounds, or you will read the previous round's `[QA] ERROR`.
- **A `cmd` step overwrites "the most recent game message", so mind the ordering (measured 2026-10-03)**: `goto parsed` takes its coordinates from "the most recent `/locate` reply", and the driver keeps only **one** `lastGameMessage` ⇒ inserting **any** `cmd` between `cmd locate …` and `goto parsed` (this round it was `forceload`, so the reply became `Marked 35 chunks … to be force loaded`) makes the parse wait and then time out (`goto_parse_failed`). **Prescription: put every `cmd` such as `forceload` / `time set day` before `cmd locate`.**
- **Whether the character lands after flying there depends on chunk readiness: add `forceload` + `land` (measured 2026-10-03)**: if the destination chunks are **not loaded yet** when `goto` arrives by flight (slow drive + the integrated server catching up), the character **falls straight into the void** (measured `y` down to `-233`, with `state.json` reading back `y=-851`), and the following `scan blocks hits=0` is a false red. The prescription (from the script that went green) = `cmd forceload add <x1> <z1> <x2> <z2>` → `wait 800` → `cmd locate` → `goto parsed …` → **`land max=1200`** → `wait 200` → `look` → `scan`. Note that the `land` step's timeout text used to **hardcode "200 ticks"** even when `max=` was passed (the generator now echoes the actual value).
- **World supply**: a singleplayer save needs `allowCommands=1` (`/locate` requires it); across loaders you can reuse `run/saves/<name>` from the **same MC version** (the client upgrades older saves on demand).
- **Closing the client** means killing the real JVM precisely by command line (the java process whose arguments include `-Dfabric.dli.config` / `-Dneoforge...`); killing only the `gradlew` wrapper leaves a client behind holding the save lock (`session.lock`).
- **The playtest driver files must be removed after testing** (see `playtest/REVERT.md`); evidence stays only in the authorized root, never in a production instance or production branch.

[[Detailed single source of truth: `community_knowledge/authored/ingame-playtest-automation.md` (bridge contract, pitfall list, finalized intent space)]]

### Second-half loop tutorial: three routes, end to end

> This section answers "**how do I get the game running from scratch, let the agent play inside it, and keep the evidence**". Per-version evidence and pitfall numbering follow `community_knowledge/authored/ingame-playtest-automation.md` (its "minimal reproduction path" holds the full command sequences for tiers A/B/C, and "intent space" is the single source for the intent menu); this section gathers the steps and operational notes scattered elsewhere into something you can follow top to bottom.

**How to pick a route**:

| Route | driverMode / tools | Coverage | Good for | Main cost |
| --- | --- | --- | --- | --- |
| ① With bridge | bridge mod + `playtest_bridge` | only versions where BlackBoxPro ships a prebuilt artifact (fabric/neoforge 1.21.1 + 1.21.11, forge 1.12.2) | fastest to get running, large action set | narrow version coverage; the bridge has no auth ⇒ local, short sessions only |
| ② No-bridge script | `generate_playtest_driver driverMode=temporary_client_tick_driver` | real driver on verified versions; structural shell elsewhere | deterministic regression / CI reproduction | you must install the driver and supply a world |
| ③ No-bridge intent session | `driverMode=in_jvm_player_agent` + `playtest_intent` | real executor coverage = `PLAYTEST_VERIFIED_TIER` (the generator's internal table, widened as evidence comes in; **the prose does not count versions**; versions outside the table get only a menu contract + a structural shell) | agent decides in real time, "wrong choice → red → switch intent" | observation granularity = once per intent; v1 `goto` has no pathfinding |

#### Route ① With bridge (fastest)

1. **Authorize**: `MC_SKILL_PLAYTEST_ALLOW=1` + `MC_SKILL_PLAYTEST_ROOT=<absolute path>` (the three channels and the prohibitions are in the root `AGENTS.md`, "Human-in-the-loop exception: in-game playtest").
2. **Install the bridge**: the BlackBoxPro jar for that side + dependencies (the fabric side needs fabric-api and FLK); **record source / version / sha256**; the jar only goes into the authorized root.
3. **Launch the game → probe**: `playtest_bridge action=status` ⇒ `ready=true` is the bar for "in the world" (the `actions` list differs per version: measured 114 on 1.21.1, 116 on 1.21.11).
4. **Enter the world**: `execute create_world` / `join_world` — creating a world takes tens of seconds, and **a response timeout ≠ failure** (measured: after the timeout the world actually existed).
5. **Drive**: action sequences come from `generate_playtest_driver driverMode=external_bridge` (`playtest/actions.json` + postconditions + evidence contract); single steps use `execute`, compound actions use `batch` + `delay`, and "wait for a condition" uses `await` (the bridge has no `wait_until`; a timeout maps to `PLAYTEST_TIMEOUT` and **must not collapse into "no failure"**).
6. **Read the result**: `inspect_playtest_evidence` (three states `present|absent|unreadable`) + `calls.jsonl` + screenshots; on failure → fix the code → rebuild via `mc-build-mod` → re-run.

#### Route ② No-bridge script driver (widest coverage)

1. **Create the project**: copy the matching version's scaffold to `<ROOT>/<platform>-<version>` — **the project directory is the game root** (`run/` is the gameDir; do not change the runDir DSL). JDK split: JDK 17 for the 1.20.1 line, JDK 21 for the 1.21.x line.
2. **Disable pause-on-lost-focus (mandatory)**: write `pauseOnLostFocus:false` in `<gameDir>/options.txt` — otherwise key-press movement is always `0.00` (when you force-kill the process MC does not write this file itself, so create it by hand).
3. **Generate the driver**: `generate_playtest_driver{platform, version, driverMode:"temporary_client_tick_driver", enterWorld:"<save name>" or leave empty, evidenceDir:"<absolute path inside the authorized root>", plan:[…] or scenario:"smoke"|"village"}` ⇒ put `PlaytestQaDriver.java` in `src/main/java/<pkg>/playtest/` and add one `PlaytestQaDriver.register();` line to the client entry point.
4. **Supply a world**: `<gameDir>/saves/<save name>/level.dat` must exist + `allowCommands=1` (needed by `/locate` and other `cmd` steps) — see "operational bits" below.
5. **Run**: `gradlew build` → `gradlew runClient`; log milestones `[QA] driver registered` → `[QA] open world requested` → `[QA] ROUND 1 START` → `[QA] DONE ::` / `[QA] ERROR:`.
6. **Hot load**: to change actions / assertions / coordinates, edit only `<evidenceDir>/plan.txt` (a new round starts inside the same process, **no game restart**); rebuild and restart only when the driver's or the mod under test's Java source changed.
7. **Read the result and clean up**: same as route ①; when done, delete the driver and the call line per `playtest/REVERT.md` (**never commit**).

#### Route ③ No-bridge intent session (the agent sends intents live; details)

> How it relates to route ② (**do not read it as two parallel lines**): it is the same driver and the same interpreter; intents are just steps that "expand into a primitive sub-plan", and the outer script degenerates into a single `waitintent` guard loop. Only one plan runs per tick.

1. **Prerequisites**: steps 1–2 of route ② **plus a verified version** (real executor coverage = `PLAYTEST_VERIFIED_TIER`, the single source of truth, widened as evidence comes in — the prose does not count versions; versions outside the table get only a menu contract + a structural shell and will not pretend to run).
2. **Enter the world**: follow that version's recipe — the frozen family (`fabric 1.20.4 / 1.21.1 / 1.21.3`) uses vanilla quick play (add `programArgs "--quickPlaySingleplayer", "<save name>"` to the loom runs in `build.gradle`) and leaves `enterWorld` **empty**; the `1.21.11` line can use `enterWorld:"<save name>"` directly.
3. **Generate**: `generate_playtest_driver{platform:"quilt", version:"1.21.11", driverMode:"in_jvm_player_agent", capabilityProfile:"operator"|"creative"|"strict_survival", evidenceDir:"<absolute path inside the authorized root>", budgetTicks:36000}` ⇒ five artifacts plus **`playtest/intent-menu.json`** (the menu contract); the default script = `mark in_jvm:intent-session` + `waitintent max=6000`.
4. **Install and run**: same as route ②; by `[QA] ROUND 1 START` the first `waitintent` tick in the world seeds `state.json` (the observation surface).
5. **Observe (read)**: `playtest_intent{action:"read", evidenceDir}` ⇒ observation surface: `intentState` (profile / menu / mailbox / remaining budget / current intent), `intents[]`, `lastIntent`, `scan.nearest{found,id,x,y,z}`, `goto{x,z,arrived,arrivedDist}`, plus `menu` and `mailbox` state and **`nextSteps`** (after a failure, the fallbacks from that intent's menu).
6. **Send an intent (write)**: `playtest_intent{action:"write", evidenceDir, intent:"walk_to", params:{x:10,z:-20,tol:3}, confirmed:true}` ⇒ writes `<evidenceDir>/intent.json` (flat JSON). **Six checks on the write side**: confirmed → forbidden list (`kill`/`tnt`/`fill`) → the 13-intent menu → parameter allowlist → required parameters → mailbox occupancy (occupied returns `MAILBOX_BUSY` unless `overwrite=true`); illegal intents are **rejected on the write side** and never reach the executor. **Two usability boundaries exposed by the first real-machine run (fabric 26.1.2, 2026-10-03)**: ① **the default menu lookup misses** — the generator writes `playtest/intent-menu.json` at the **project root**, while the tool looks for `<evidenceDir>/intent-menu.json` and then `<evidenceDir>/../playtest/intent-menu.json`; when `evidenceDir` is (as recommended) outside the project (`<authorized root>/instances/<tag>/evidence-intent`) both miss ⇒ **you must pass `menuPath=<project root>/playtest/intent-menu.json` explicitly**, otherwise you get `MENU_NOT_FOUND`. ② **`observe` needs `entities=` or `blocks=`** — passing only `radius=` is judged red as `observe_need_scan` (v1: an empty scan has no criterion to judge); that is fail-closed design, not a bug.
7. **Session loop**: `read` to observe → pick an intent (on failure switch per `nextSteps`) → `write` → the driver consumes it (renames `intent.json` to `intent.done.json`) → expands it into primitives → judges **exactly one** typed postcondition → appends to `intents[]` and refreshes `state.json` → back to guarding. **Failures must not be retried automatically** (retrying a one-shot intent would re-consume blocks or trigger side effects again); switch intents instead.
8. **Wrap up**: `write {"intent":"stop"}` ⇒ ends the round (**does not close the game**); then clean up per `playtest/REVERT.md`.

**Measured chain (deobfuscated fabric 26.1.2, first real-machine run 2026-10-03)**: `observe` (rejected first by `observe_need_scan` → after adding `blocks=`, `scan_written`, `scan.nearest=oak_log@-34.5,71,-2.5`) → `walk_to{x:-34,z:-2,tol:3}` → `distance_le_tol_and_moved_ge_min`(`dist=2.75 traveled=6.28`) → `screenshot` → `screenshot_file_nonempty`(`2026-10-03_20.22.16.png bytes=351378`) → `stop` → `driver_stops`; `exit-code=0`, and round 2 of `rounds.jsonl` is `ok:true intents:5`. **Two operational readings**: the `at` field in `state.json` is the **time of the last intent** (not the file's write time) ⇒ to judge whether the driver is alive, look at the **process + the file mtime + `intent.done.json`**, not at `at`; and the `screenshot` PNG lands in **`<gameDir>/screenshots/`** (the gameDir of `runClient` is `run/`), not at the project root. The default script's `waitintent max=6000` (5 min) can expire before you send your first intent (the whole round is then judged red) — the driver **does not exit**, it falls back to the idle state guarding `plan.txt`, and **rewriting `plan.txt` once starts a new round in the same process** (`max=30000` is steadier).

**Failure semantics (the most important difference across the three routes)**: a failure at the mailbox level is **data** (`intents[]` records `ok:false` plus a `failure` field) and **guarding continues** (the session stays alive); protocol violations (forbidden list, not in menu, wrong profile) are rejected by the tool on the write side; failures in script form (an `intent` step inside `plan.txt`) are **judged red and stop the round**.

**Budget and protocol**: per-intent cap = the `budgetTicks` column in the menu (`walk_to` 1200 / `find_and_goto` 9000 / the rest 60–600); a single guard run is 5 min (`waitintent max=6000`); a full round defaults to 30 min (`budgetTicks=36000`); the mailbox is **single-slot** (while one intent is running, newly written intents wait in the mailbox and a second write is rejected). A wrong parameter (e.g. `x=abc`) is judged red as `param_not_number`; it **never** silently falls back to a default.

**v1 implementation surface and known limits**: implemented = `walk_to` / `look_at`(yaw|pos) / `find_and_goto`(structure|block|entity) / `observe` / `open_gui` / `inventory` / `screenshot` / `wait`(ticks) / `tp`(op/creative) / `stop`; `mine`/`place`/`interact` and `wait until=` are not implemented (a hit is judged red, never silent). `goto` has **no pathfinding** (straight line + `fly` + a cruise speed of 140 with anti-stuck; complex terrain times out → switch intent); the `structure` form needs cheats enabled in that world; the `block` form only samples a thin vertical layer of `-4..+8` (start near the target height); `entity` only covers roughly the 48-block tracking range; if a village has no villagers in range, suspect an abandoned village first (try another one).

**Real-machine readings (as-of 2026-10-01, `quilt 1.21.11` / `operator`)**: four sessions, all `exit-code=0` — including the intent-switch chain "`find_and_goto{diamond_ore}` miss judged red → switch to `structure` → PASS", `entity:villager found=true dist=0.62`, `block:hay_block onGround=true`, screenshot `ageMs` freshness as the criterion, and the `walk_to{x:abc}` negative case judged red. Per-item readings are in the single source of truth, "intent space" → "executor implementation surface".

#### Second-half loop operational bits (scattered everywhere, gathered here)

| Item | How |
| --- | --- |
| JDK split | 1.20.1 line = **JDK 17**; 1.21.x line = **JDK 21** (point `JAVA_HOME` at the matching version; on older lines you can add `-Porg.gradle.java.installations.paths=<jdk17>`) |
| Authorization | `MC_SKILL_PLAYTEST_ALLOW=1` + `MC_SKILL_PLAYTEST_ROOT=<absolute path>`; evidence and driver files stay in that root only |
| Pause on lost focus | write `pauseOnLostFocus:false` in `<gameDir>/options.txt` (MC does not write it after a force-kill; this single line is enough to run) |
| World supply | create a world once with a vanilla server of the **same MC version** (`eula=true` + `server.properties` with `level-name` / `gamemode=creative` / `online-mode=false`) → wait for `Done (…)` → `stop` → copy `saves/<name>/` into each version's `<gameDir>/saves/` (same version works across loaders); **enabling cheats** = flip the `allowCommands` payload byte `0→1` in `level.dat` (gzip NBT, same-length rewrite; locate it by "the first 3 bytes are the tag type, the first 2 bytes are the length"); afterwards **confirm no client still holds that world** (otherwise the old client writes the value back to 0 on exit) |
| Entering the world (frozen family) | for `fabric 1.20.4 / 1.21.1 / 1.21.3` the driver must **not** call `IntegratedServerLoader.start` (it freezes the render thread in a `Thread.sleep` waiting for the server to load, proven by jstack) ⇒ use vanilla quick play (`--quickPlaySingleplayer "<save name>"`) and leave `enterWorld` empty; the `1.21.11` line can use `enterWorld` |
| Assets stuck | if the first `:downloadAssets` fails or produces no output for a long time: ForgeGradle and Loom asset caches **can borrow from each other**; find a missing object via the official manifest → `assetIndex.id` → `indexes/<id>.json`, then compare sizes; overwrite a corrupt (truncated) file using the real path `assets/objects/xx/<hash>` (content-addressed, same path) |
| First run dies at mixin prepare | old clones of `fabric 1.20.1 / 1.20.4 / 1.21.1`: the scaffold's `filesMatching` needs `examplemod.mixins.json` added (already fixed in the library) |
| Closing the client | kill the real JVM precisely (the `java` process whose command line contains `-Dfabric.dli.config`); **do not kill only the `gradlew` wrapper** — a leftover client holds the save's `session.lock` and the next world entry reports "another program has locked a part of the file" |
| Separate instances | use a separate runId / instance per run (sharing a runDir silently overwrites screenshots) |
| Reading evidence | `inspect_playtest_evidence` (three states; **a missing item must not be read as "no failure"**); `rounds.jsonl` must be **one valid JSON object per line** (entries `{intent,params,ok,postcondition|failure,detail}`); check screenshot freshness via `ageMs` (negative means clock jitter); `qa.log` must be a `.log` file (the reader takes the `[QA]` section from the tail of any `.log` in the directory) |
| Cleanup | delete the driver file and the `register()` call line; evidence stays only in the authorized root; self-check with `git status` for zero hits — **never commit** |

> Detailed procedures, pitfall numbering, and every real-machine reading for the three routes: `community_knowledge/authored/ingame-playtest-automation.md`; historical ledger: the per-batch entries in `mcp-server/CHANGELOG.md`.

## Quick start

**For the AI (when opening an MC mod project):**

> Follow the root `AGENTS.md` to identify the platform and the **exact** version, then call `activate_platform_pack action=session` to load that version's rules / Skill index (do not read a neighbouring version's `platform/<ver>/.cursor` directly). For official docs, call `list_*_versions` first, then pin `version` to the project version for `search_*_docs` / `search_docs`. Creative design is the user's call; compatibility trade-offs and API choices default to the user as well, and the agent may decide when the user does not want to or cannot, but then it must explain using the template below (the template is also written into the root `AGENTS.md` under "Human in the loop", binding on agents). Writing files, running Gradle, copying jars, uploading — all require confirmation first (human in the loop, not an unattended pipeline).

### Explanation template (mandatory format when deciding on the user's behalf)

1. **Transparent decision**

   Any compatibility trade-off or API choice made on the user's behalf must be stated explicitly right after the decision, never executed silently.

   Example format:

   > I picked `DeferredRegister` for you; the reasoning is below.

2. **The explanation must contain four parts**

   Every decision made on the user's behalf must explain at least:

   - **What was chosen**: the concrete technique or approach (for example "use Forge 1.20.1's `SimpleChannel` instead of NeoForge's `Payload`").
   - **Why it was chosen**: how it relates to the current version, the docs, best practice, or the user's project (for example "NeoForge 1.20.1 is a Forge compatibility layer, and the official docs point to SimpleChannel").
   - **The main alternative**: one or two other options, and why they were not used (for example "you could also use NeoForge 1.20.4+'s `Payload`, but your version is 1.20.1, so it does not apply").
   - **Impact and risk**: consequences, limits, or things to watch out for (for example "this makes the build depend on the `net.minecraftforge` package, so check that your project includes that dependency").

3. **Match the explanation to the user's level**

   - If the user says "I'm not very technical" or "just decide" → avoid stacking jargon; explain in plain language what the choice will mean for them.
   - For professional developers → more technical evidence is fine (class names, method signatures, doc links).
   - Either way, you must give **a verifiable source** (the result of `search_forge_docs`, a rule number, an official doc link). "Best practice" alone is not an answer.

4. **High-risk decisions need confirmation first**

   - **Low-risk decisions** (picking an API style, recommending a dependency version): the agent may decide, but must explain right after acting, per point 2.
   - **High-risk decisions** (switching loader platform, changing package structure, removing dependencies, editing build scripts): even if the agent may decide, it should briefly present the recommendation and the reasoning and wait for the user to confirm, unless the user has already said "don't ask me, just do it".
   - If the user says "I don't know, you decide" → treat it as authorization, but still explain the decision afterwards and say how to revert it.

**Using the scaffold for a new project:**

> Use `scaffold/` under the matching platform version (e.g. `forge/1.20.1/scaffold/`) to generate a project skeleton that already carries the rules.

**Syncing multiple IDEs:**

> After editing `.cursor/`, run `sync-skills.ps1` in that version directory. The IDE directory list and the batch sync commands are in [For humans](README_human.en.md#multi-ide-support).

**Configuring the local MCP server:**

> Drop [AUTO_SETUP.md](./AUTO_SETUP.md) into your AI IDE / CLI. The agent should detect the host (Cursor / Claude Code / VS Code / Continue / Trae / OpenCode / Codex, etc.), build `mcp-server`, produce a config draft in that host's format, and **merge it only after you confirm** (it never overwrites silently).  
> Requires **Node.js >= 22.5** (**22.5–22.12 and 23.0–23.3 must be started with `--experimental-sqlite`** — the built-in `node:sqlite` is only on by default from 22.13 / 23.4; the MCP/CLI entry point probes for that window before any sqlite use and, if it hits, prints a loud pointer and exits non-zero). Service name `MC-AI-Coding-Assistant-Tool` (stdio, 86 tools). With no MCP client available, use `node mcp-server/dist/cli.js`.
>
> **The full installation steps are not in this file** — [AUTO_SETUP.md](./AUTO_SETUP.md) is the one and only install manual. Follow its steps: Step 0-pre verifies the absolute paths in an existing config → Step 1 identifies the host → Step 2 checks Node and runs `npm ci && npm run build` (including the **four post-build self-checks**) → Step 3 computes the paths and the canonical stdio payload → Step 4 produces a config draft for that host → Step 5 merge + reload + **verify by calling tools** (the agent calls the tools itself; do not just ask the user to look at the UI) → Step 6 (optional) install Skills. That file also has a "Common errors" section and a CLI fallback section, and its opening "Agent must-read: execution order" is a hard constraint on agents.

## Community knowledge and library mods

Separate from the **official** Forge/Fabric/NeoForge docs under `data/`, this repo carries two more practical knowledge sets for the agent to use in publishing, crash triage, soft dependencies, library selection, and dependency-tree work. **Neither replaces** `search_*_docs` or `query_api`.

### Community practice knowledge (`community_knowledge/`)

| Directory | Meaning | Note for the agent |
|------|------|------------|
| `authored/` | short essays written in this repo (editable) | practice checklists and anti-patterns, **not API specifications** |
| `permitted/` | community posts distilled with the author's permission | when still unsure, open the original URL |
| `links/` | title / summary / external link only | **forbidden** to treat the web page body as ingested full text |

Index: `indexes/index-l0.json` (about **110** entries). MCP: `list_community_sources` → `search_community_docs` → `get_community_doc_summary` / `get_community_doc_full`. The environment variable `MC_SKILL_COMMUNITY` can change the root path.

**Topic quick reference** (the full table is in [`community_knowledge/README.md`](./community_knowledge/README.md)): publishing / crash triage / soft dependencies / machine GUI / localization / code patterns (`patterns/`), and so on. **Library integration** has its own 48 `authored/lib-*.md` files plus the overview `library-catalog-2026`, the traps `lib-traps-2026`, and the recipe integration notes `library-integration` / `library-integration-jei-emi`.

**Mandatory rule**: before writing code from a community essay, if a method name or version detail is uncertain you must first check the original source or the official docs the essay points to (see [`community_knowledge/AGENT_USAGE.md`](./community_knowledge/AGENT_USAGE.md)).

### Library mod knowledge system (`knowledge/libs/` + the data chain)

Three layers (details in the MCP tool sections **§7 / §7.5** below):

1. **Community essays** — `authored/lib-*.md`, searchable through `search_community_docs`; each has a decompilation-verified section (the source of `verifiedApi`).
2. **Library Skill sources** — `knowledge/libs/<group>/mc-<name>/SKILL.md`, **not written** into platform `.cursor/skills`; resolved per the "library Skill" rules in `AGENTS.md`: platform → group mapping (`forge-only`+`all-platforms` / `fabric-only`+`all-platforms` / `neo-only`+`all-platforms` / `bedrock-only`) plus a second filter on frontmatter. Unsure which library to use → read `knowledge/libs/all-platforms/mc-lib-catalog/SKILL.md` first.
3. **Data chain** — essay frontmatter → `mcp-server/scripts/build-library-catalog-from-authored.mjs` → `library-catalog.ts` (**50** entries / **2632** `verifiedApi` keys) + `lib-manifests/all.json` (**49** slugs / **3,003** version entries; computed 2026-09-25 (the full post-recrawl surface; the older **48 / 2,870** figures were the truncated first-page snapshot from before the pagination fix, see `mcp-server/README.md` §data sources and boundaries) — the measure is the `length` of that file's top-level array for the slug count, and the sum of each element's `entries` array length for the version entries) + `lib-api-summaries/` (**48** library API summaries) → `check_dependencies` recognizes dependencies and version windows. (Counting rules and script locations are in §7.5)

**Recommended agent path (library-related)**: `check_dependencies` (look at `detectedLibraries`) → `search_community_docs` (`lib-<name>` or `library-catalog-2026`) → read `knowledge/libs/.../SKILL.md` by `skillId` or name → if a signature is still missing, go to `search_*_docs` / `query_loader_api`.

## Environment variables

| Variable                      | Meaning                                     | Example                                |
| ----------------------- | -------------------------------------- | --------------------------------- |
**Common (what most users touch)**

| Variable                      | Meaning                                     | Example                                |
| ----------------------- | -------------------------------------- | --------------------------------- |
| `MC_SKILL_DATA`         | Root of the data directories (points at `data/`, not at a version subdirectory)            | `<repo root>/data`                |
| `MC_SKILL_COMMUNITY`    | Root of the community knowledge base (defaults to the repo's `community_knowledge/`) | `<repo root>/community_knowledge` |
| `MC_SKILL_ALLOW_WRITE`  | Set to `1` to let `port_project` write to disk              | `1`                               |
| `MC_SKILL_PROJECT_ROOT` | Project root allowed for writes (absolute path)                         | `<absolute path to your mod project>`                  |
| `MC_SKILL_STRICT`       | Set to `1` to make MCP startup fail when data is invalid                    | `1`                               |
| `MC_SKILL_DEBUG_PATHS`  | Set to `1` to print path resolution steps (turn it on first when "can't find data/") | `1` |
| `MC_SKILL_CACHE`        | Cache root for decompilation / MDK / loader jars. Both MCP and the scripts read it; when unset, MCP defaults to APPDATA while the scripts default to `os.tmpdir()/mc-skill-cache`, which splits them apart | `%APPDATA%/mc-skill-cache` (scripts fall back to `os.tmpdir()/mc-skill-cache`) |
| `JAVA_HOME`             | JDK used for decompilation / remap (needs 17+; when missing the tools return `TOOLCHAIN_MISSING`) | `<Temurin 17+ install dir>`           |
| `MC_SKILL_PLAYTEST_ALLOW` | Set to `1` to open the authorization gate for the three playtest channels (must be paired with `MC_SKILL_PLAYTEST_ROOT`) | `1`                               |
| `MC_SKILL_PLAYTEST_ROOT` | Playtest authorization root (absolute path; the target's real path must fall inside it) | `<authorized instance world root>`                     |
| `MC_SKILL_SKIP_DOWNLOAD` | Set to `1` to make the decompilation tools skip every download and fail honestly. **It must be set to the literal `1`** (the implementation compares `=== "1"` strictly, see `mcp-server/src/decompile/java/java-process.ts:168`; leaving it unset or setting `true` does nothing). This repo's `.github/workflows/` **all four workflows set it** (verified live as of 2026-10-02) | unset (download on demand by default)      |

**Advanced / troubleshooting (set as needed; most cases don't need these)**

| Variable                      | Meaning                                     | Default / example                                |
| ----------------------- | -------------------------------------- | --------------------------------- |
| `MC_SKILL_JAVA_SCAN_MAX_FILES` | File cap for the Java source scan in `validate_project` and friends | `300`                        |
| `MC_SKILL_JAVA_TIMEOUT_MS` | Decompiler subprocess timeout in ms (invalid values are ignored and fall through) | built-in fallback                        |
| `MC_SKILL_SCRIPT_TIMEOUT_MS` | **CLI-side** script subprocess timeout in ms (unset = no timeout, so long runs aren't killed) | unset                   |
| `MC_SKILL_MAX_ENTRY_BYTES` | Max uncompressed size of a single entry when inflating (zip-bomb guard)             | `268435456` (256 MB)            |
| `MC_SKILL_MDK_CHECKSUMS` | Override path of the MDK checksum pin file                      | `mcp-server/data/mdk-checksums.json` |
| `MC_SKILL_BEDROCK_API_PIN` | Override path of the Bedrock Script API pin file                  | `mcp-server/data/bedrock-script-api-pin.json` |
| `MC_SKILL_FETCH_BACKEND` | Set to `curl` to route GitHub fetches through the system `curl.exe` (escape hatch when Node TLS fails) | unset (try Node, fall back to curl) |
| `MC_SKILL_GITHUB_API_BASE` | GitHub API mirror base (also added to the fetch host allowlist)     | unset (`api.github.com`)           |
| `MC_SKILL_GITHUB_TIMEOUT_MS` | GitHub request timeout in ms                        | built-in fallback                        |
| `MC_SKILL_GITHUB_TOKEN` / `GITHUB_TOKEN` | GitHub token for self-update / upstream queries (raises rate limit, avoids anonymous throttling) | unset                   |
| `MC_SKILL_UPDATE_REPO` / `MC_SKILL_UPDATE_REMOTE` | Self-update repo slug / forced git remote name     | `guguzea/MC-AI-Coding-Assistant-Tool` |
| `MC_SKILL_UPDATE_CACHE_TTL_SEC` | Self-update check cache TTL (seconds)                    | `3600`                            |
| `MC_SKILL_UPDATE_DOWNLOAD_TIMEOUT_MS` | Self-update download timeout in ms                   | `600000`                          |
| `MC_SKILL_UPSTREAM_CACHE` | Set to `0` to disable the `query_upstream_releases` disk cache entirely  | unset (per-tier TTL)                    |
| `HTTP_PROXY` / `HTTPS_PROXY` / `ALL_PROXY` (and all-lowercase forms) | Proxy for fetches                         | unset                              |
| `APPDATA`               | Windows base for the default cache root (when `MC_SKILL_CACHE` is unset) | system value                          |
| `NODE_OPTIONS`          | Node 22.5–22.12 / 23.0–23.3 need `--experimental-sqlite` in here | unset (not needed on 22.13+ / 23.4+)      |
| `MCP_TIMEOUT_MS`        | **Test/CI-side** timeout in ms (read by `test-mcp.mjs` / `release-smoke.mjs` / the four CI workflows; the **MCP server process itself does not read it**) | `30000`            |

> The table above covers the surface with user-visible behavior; it is not exhaustive. The server source actually reads **37** distinct environment-variable names (as of 2026-10-02); the rest are internal debug switches. To get the full list, scan `mcp-server/src/**` for `process.env.*` (`MC_SKILL_STRICT` / `MC_SKILL_DEBUG_PATHS` are already listed above; `ComSpec` / `COMSPEC` and similar are spawn details that need no configuration).

## Notes on using the MCP tools

The local MCP service is named `MC-AI-Coding-Assistant-Tool` (**86** tools). Configure it with an **absolute path** and point `MC_SKILL_DATA` at this repo's `data/`. Requires **Node.js >= 22.5** (the Yarn mappings use the built-in `node:sqlite`; **22.5–22.12 and 23.0–23.3 need `--experimental-sqlite` in NODE_OPTIONS or the launch arguments, 22.13+ / 23.4+ do not**). The repo / Release **does not** include `node_modules`, so you must run `npm ci && npm run build` yourself (running `npm run build:yarn-sqlite` afterwards is recommended).

**Tests**: `cd mcp-server && npm test` (build + all unit suites: core / scripts / data audit / Wave BCD / localize / update / CLI / decompile / deep mixin / MCP protocol). CI semantics: the job env of all four workflows under `.github/workflows/` sets `MC_SKILL_SKIP_DOWNLOAD=1` uniformly, so download-based tools fail honestly in CI instead of silently hitting the network (that variable may only be relied on after `node test-decompile.mjs` passes inside `mcp-server`). The CLI also has two separate gates: `npm run test:cli:quick` (`mcp-server/scripts/assert-cli-quick.mjs`, fast tier, wired into the default gate chain) and `npm run test:cli:full` (`mcp-server/scripts/assert-cli-full.mjs`, full tier — the authoritative list is taken at run time: entry contract probes + real calls + per-item waiver reasons, **not run by default**).

### Post-install acceptance and npm script reference

After installing (or on a fresh clone), run the four checks below; **go no further until they are all green**:

```bash
cd mcp-server && npm ci && npm run build     # dist/ is not committed, you must build it
node dist/cli.js --version                    # should print a version (package.json is currently 1.0.4)
node dist/cli.js list-tools --names-only      # should return 86 tool names
node dist/cli.js activate_platform_pack --action=list   # should return the platform/versions built on this machine
node dist/cli.js diagnose_data_paths          # each platform should be found; empty / not_found = MC_SKILL_DATA is wrong
```

If the tools are all uncallable inside the MCP host, it is usually an unbuilt `dist/` or an unreloaded host (installing new `dist/` still requires **reloading MCP**). See `AUTO_SETUP.md` and "Tool not working" below.

Common scripts after `cd mcp-server` (the full set of 33 lives in `mcp-server/package.json`):

| Script | Purpose | When to run |
|---|---|---|
| `npm run build` | `tsc` compile into `dist/` | after source changes; before MCP/CLI |
| `npm ci` | install dependencies | fresh clone (repo/Release ships no `node_modules`) |
| `npm test` | full gate chain (build + unit suites + the `assert-*.mjs` gates) | before committing |
| `npm run test:core` | core unit tests (includes rule loading / compatibility-comment pins) | changed core / rule loading |
| `npm run test:cli` | CLI contract tests (arg parsing + envelope + exit codes) | changed CLI entry / envelope / exit codes |
| `npm run test:cli:quick` / `test:cli:full` | CLI fast tier (in the default chain) / full tier (not run by default) | changed CLI |
| `npm run test:scripts` | the `mcp-server/scripts/**` gate chain | changed scripts / gates (**must run before wrapping up**) |
| `npm run test:audit` | data-audit unit tests | changed `data/` or the auditor |
| `npm run test:semantic` | semantic-index unit tests | after rebuilding the semantic store |
| `npm run test:decompile` / `test:deep-mixin` | decompilation / deep mixin (needs JDK 17+) | changed decompilation / bytecode checks |
| `npm run test:update` | self-update unit tests | changed `src/update/` |
| `npm run build:yarn-sqlite` | rebuild the Yarn mappings SQLite (`--all`) | first time / after a version change; before `convert_mapping` |
| `npm run fetch:embedding-model` | download the local embedding model | before first building the semantic index |
| `npm run build:semantic-index` | rebuild the semantic index (`npm run … -- --all`) | for offline / semantic retrieval |
| `npm run build:vanilla-registries` | rebuild Vanilla registry data (`-- --version=<v>`) | changed `query_registry` data |
| `npm run audit:data` | full cross-platform data consistency audit (any ERROR = not publishable) | before publishing the data pack |
| `npm run audit:data:forge` / `:fabric` / `:neoforge` / `:fail-on-error` | single-platform / all-platform fail-on-error | changed only one platform |
| `npm run community:index` | rebuild the community L0 index (`--write`) | after adding/removing `community_knowledge/` entries |
| `npm run smoke:release` | release smoke test | before packaging |

> The rest (`test:w3` / `assert:no-yarn-slurp` / `build:yarn-named` / `repair:quilt-indexes` / `audit:quilt-indexes` / `fetch:quilt-docs` / `fetch:bedrock-docs` / `fetch:vanilla-registries`, and others) can be looked up directly in `mcp-server/package.json`.

### Two first-class entry points: MCP and CLI (promoted 2026-09-17)

One core, two adapters (**neither forks**): MCP (stdio, for AI hosts) and the CLI (terminal / scripts, for humans). Same prerequisites as MCP: Node ≥ 22.5 + `cd mcp-server && npm ci && npm run build` (the CLI runs from `dist/`).

#### Entry point one: the tool line (= the MCP tools, all callable)

```bash
node mcp-server/dist/cli.js --version
node mcp-server/dist/cli.js list-tools --names-only                    # list of tool names
node mcp-server/dist/cli.js list-tools --tool resolve_lib_skills       # schema for one tool
node mcp-server/dist/cli.js search_docs --platform fabric --version 1.21.1 --query registry
node mcp-server/dist/cli.js resolve_lib_skills --platform fabric --mcVersion 1.21.1
node mcp-server/dist/cli.js check_dependencies --project .
node mcp-server/dist/cli.js crash_analyze --crashReport @./crash-reports/latest.txt
```

- **Argument conventions**: flags-only (`--key value` / `--key=value` / bare `--flag` → true); `--file field=path`, `@path` / `@-` (read a file / stdin), `--stdin-json` (base object for all parameters, same-named command-line values always win), `--raw [field]` (literal escape hatch), `--timeout <ms>`, `--quiet`, `--project <dir>`, `--output-format json`. **Parameter names follow each tool's schema** (e.g. `resolve_lib_skills` uses `--mcVersion`; run `… <tool name> --help` when unsure).
- **Output**: always a JSON wrapper `{success, tool, result|error}`; **exit codes** 0 = success / 1 = tool failure or timeout (`errorKind: tool_failure | timeout`) / 2 = usage error (`usage | validation`).
- **Project-scoped tools**: `--project <dir>` maps to `projectPath`; `--fail-on-error` promotes `found:false` / a non-empty `errors[]` to exit code 1.
- All details (the full global flag table / aliases / field precedence / migration notes) are in the "Standalone CLI" section of [`mcp-server/README.md`](./mcp-server/README.md).

#### Entry point two: the repo line (maintenance-side script subcommands)

```bash
node mcp-server/bin/mc-skill-scripts.mjs --help                 # full command table
node mcp-server/bin/mc-skill-scripts.mjs lib resolve --platform fabric --version 1.21.1
node mcp-server/bin/mc-skill-scripts.mjs lib resolve --validate # resolution check per combination (the combination list follows VALIDATE_COMBOS inside the script; same gate as test-core §S15)
node mcp-server/bin/mc-skill-scripts.mjs lib summary --only libgui --write
node mcp-server/bin/mc-skill-scripts.mjs lib ownership          # G1 library-ownership gate
node mcp-server/bin/mc-skill-scripts.mjs corpus decompile --filter slug=cloth-config,jei
node mcp-server/bin/mc-skill-scripts.mjs corpus merge --input x.jsonl --dry-run
node mcp-server/bin/mc-skill-scripts.mjs cloth project          # injection marker ↔ versions.json check
node mcp-server/bin/mc-skill-scripts.mjs gate list
node mcp-server/bin/mc-skill-scripts.mjs gate run lib-ownership # run one gate (exit code passed through)
```

- Nine commands = `lib resolve|summary|ownership` · `corpus decompile|emit|merge` · `cloth project` · `gate list|run`;
- **Thin shell**: it forwards to the existing scripts under `scripts/` and `mcp-server/scripts/` with arguments and exit codes passed through unchanged; `… <group> <command> --help` prints the command's help (a script's own `--help` runs the script directly);
- **Boundary**: the CLI must run inside the repo (the scripts live in the repo root `scripts/` and `mcp-server/scripts/`); the repo line is **maintenance-side** work (batch decompilation / summary rebuilds / the G1 gate / injection write-back) and is not exposed on the MCP tool surface.
- Smoke gate: `mcp-server/scripts/assert-cli-smoke.mjs` (both entry points' `--version`/`--help` + 8 × `--help` + `gate list` + `lib resolve` really run ×2) is wired into `test-core` §S16. After a global install (e.g. `npm i -g ./mcp-server`) both entry points appear as bins: mc-skill and mc-skill-scripts.

> **Library mod files stay directly readable by the AI**: `knowledge/libs/**` is "the source is the usable file" — the AI **reads the files directly** per the "library Skill" rules in `AGENTS.md`; `resolve_lib_skills` (the same core behind the MCP tool and the CLI's `lib resolve`) only does **resolution and ground-truth hints** (returning repo-relative paths + `versionsJson`), and **never replaces the file or caches the body**.

### Vector / semantic search (T1)

`search_forge_docs` / `search_fabric_docs` / `search_neoforge_docs` / `search_docs` are **hybrid by default**, not "L0 titles only". Implementation: L0 keyword ranking ∪ (FTS5 full text + MiniLM vector cosine), then **RRF fusion**; hits may carry `matches[]` (top-K from the chunks table: `sectionHeading` / `snippet` / `score`). A `semantic: true` in the response means the semantic store was used this round.

**Three degradation tiers** (fall back one tier when something is missing; no errors, no invented data, and no remote model fetch at runtime — `allowRemoteModels=false`):

| Tier | Condition | Behaviour |
|----|------|------|
| `hybrid` | `semantic/db.sqlite` exists, embeddings are non-empty, and `data/_models/Xenova/all-MiniLM-L6-v2` is ready | L0 + vectors + FTS5, fused with RRF |
| `fts5-only` | the semantic store exists but the embedding model is missing, or the embeddings table is empty | full-text keyword search (FTS5), no vector scoring |
| `l0-only` | that version/data source has no semantic store (`semanticSearch` returns `null`) | matches L0 index fields only (`label` / `id` / `url` / `tags`); results carry `semantic: false` plus a warning |

The global `get_server_status.semanticIndex.modeHint` is the **machine-wide** tier (any hybrid tree with a ready model → `hybrid`). A **single query** can still be L0: Forge 1.7.10 has no tutorial semantic store, for example. Read that query's own `semantic` and `warning`; do not rely on modeHint alone.

Missing model at build time: warn and degrade to fts5-only (no exit 1). `diagnose_data_paths.semantic` reports whether the db beside each doc tree exists.

**Where the data and models live**: semantic stores at `data/{platform}_{ver}/{source}/{ver}/semantic/db.sqlite` (`forge_javadoc` skipped), currently **60** of them (measured 2026-09-13: `find data -type f -name db.sqlite -path "*/semantic/*"`; excluding `db.sqlite.tmp-*` / `-journal` leftovers, and `forge_javadoc` trees never had a semantic store); the embedding model at `data/_models/Xenova/all-MiniLM-L6-v2` (transformers.js, **the only place allowed to fetch a model remotely**). Build: `npm run fetch:embedding-model`; `npm run build:semantic-index -- --all` (also accepts `--platform` / `--version` / `--source` / `--no-embed` / `--force`; interruptible and resumable). Artifact manifest: `data/semantic-index-manifest.json`.

#### How the agent calls it (two entry points, two steps, one field)

**Entry A: the MCP tool** (the proper route once the AI IDE has `MC-AI-Coding-Assistant-Tool` attached). Pick the tool by platform; the only parameters are `version` + `query`, and the semantic layer participates **automatically** — there is no switch:

- Forge → `search_forge_docs { version: "1.14.4", query: "entity goal" }`
- Fabric → `search_fabric_docs { version: "1.21.4", query: "custom enchantment effect" }` (run `list_fabric_versions` first to confirm the indexed version name)
- NeoForge → `search_neoforge_docs { version: "1.20.1", query: "..." }` (1.20.1 falls back to the Forge corpus; that is expected)
- General (quilt / liteloader / rift / modloader, etc.) → `search_docs { platform: "...", version: "...", query: "..." }`

**Entry B: the standalone CLI** (no MCP client, or you want to verify in a shell right away — also the way to test right after editing source without reloading the host):

```bash
node mcp-server/dist/cli.js search_forge_docs --version=1.14.4 --query="entity goal selector"
```

(`MC_SKILL_DATA` points at `data/`; tool output is always JSON, and `--json` does not change tool output.)

**Two steps**: take the **`id`** from the `search_*_docs` result (not the website URL) → read the body with `get_*_doc_full` / `get_*_doc_summary`. At most 2 pages at a time, so the context does not overflow.

**Response contract**: `{ ok, total, totalPool, truncated, semantic, results: [{ id, score, … }], matches? }`. **On the doc-search surface `total` is the number of rows returned this time** (= `results.length`, which follows the `limit` you pass), **not** the total number of corpus hits; to judge "did I get everything", read the other two keys that are **always** in the payload: `totalPool` = how many candidates that surface had before windowing, `truncated` = (`total < totalPool`) (landed 2026-09-28, all eight emit sites covered; on most surfaces `limitWindow.candidates` is still the window, not the pool, and the bedrock surface has its window block under `demotion`). **Residual caveat**: `totalPool` only goes as deep as "what this surface can offer", not the whole corpus (fusion input and L0 retrieval each have their own caps). For `query_loader_api` / `query_upstream_releases` / `search_mod_code`, `total` **is** the full pool ⇒ the two families of formulas have opposite signs; do not copy one into the other. The agent must read the `semantic` field:
- `semantic: true` = this round went through the semantic store (FTS5 BM25 + MiniLM vector cosine, RRF fused); hits can be treated as relevance-ordered coverage evidence;
- `semantic: false` = degraded to L0 keywords (that tree has no semantic store / the embedding model is missing / `semanticSearch` returned null), with a warning — hits are then **not exhaustive**, and `found:false` proves nothing;
- hits may carry `matches[]` (`sectionHeading` / `snippet` / `score`), and the snippet comes from real body text in the chunks table, so it can be quoted directly.

**Agent-side rule** (the "when uncertain" clause in the root `AGENTS.md`, in force since 2026-09-19): when looking up APIs / docs / mechanisms, **search semantically first**; `query_api` / `query_loader_api` are compatibility tools (see the next section) and only serve as fallback.

#### The query_\* compatibility tools and the 1.14.4 / 1.15.2 boundary report (2026-09-19, sweep104)

`query_api` / `query_loader_api` are marked as **compatibility tools** (class-name / signature indexes whose coverage varies by version and is limited). Every response now says so explicitly instead of staying silent:

1. **Every `query_api` response**: the `notes` end with "query_api is a compatibility tool … prefer semantic search through search_forge_docs / search_docs for docs and semantics".
2. **`query_api` on 1.14.4 / 1.15.2**: the `warning` reports the boundary explicitly — the empty api-index for these two versions is **by design** (the MCP stable CSV only has member-level searge↔named, and the Parchment index only exists from 1.16.5 on), so `found:false` does not mean the class is absent from the game; the response recommends `search_forge_docs` **semantic search** instead (the corpus and semantic store are complete for these versions: 1.68MB / 1.32MB, measured `semantic: true`) plus `convert_mapping` (the 1.14–1.15 CSV only has searge↔named, so **class names cannot be looked up**, method names can). Background: these two old versions used to fall silently between the "1.7–1.13 empty-shell warning" and the "classCount===0 warning" branches; sweep104 added a dedicated branch.
3. **Every `query_loader_api` response**: `notes` gains a compatibility note (coverage bounded by the versions already ingested).
4. **Second-tier source `nameIndex` (2026-09-25)**: when `query_api` misses in the api-index, or that version has no Parchment index at all (e.g. 1.21.x Fabric, or NeoForge versions without an extracted index), it queries the on-disk mapping index `data/<platform>_<version>/mappings/yarn-mappings.sqlite` and attaches the result as `nameIndex`: `exists` / `matchKind` (exact｜simple-unique｜ambiguous｜contains｜none) / `named` / `memberCounts` / `memberSample` / **`mappingEra` + `dbKind`**. Three boundary conditions, all required: `found` still stays `false` (existence never masquerades as a signature hit), `mappingEra` must be read (`named` for `yarn-tiny` is a Yarn name; for `forge-srg`/`tsrg`/`mcp-csv` it is the MCP `func_/field_` name; for `mcp-config-srg` (the six Forge versions 1.16.5–1.20.4) it is an SRG class name plus `m_N_/f_N_` member names), and when that version has no store or the table is empty the **entire key is absent** (no fabricated tier). **Store selection follows the loader** (added 2026-09-26): this tool's api-index only reads `data/forge_<ver>/extracted`, so `nameIndex` also picks the store along the Forge line; the versions 1.16.5–1.20.4 that have stores in both trees no longer get answered by fabric's yarn-tiny (before the fix it even gave the wrong package: `RenderCall` lives in `blaze3d/systems/` in Yarn but in `blaze3d/pipeline/` here); when Forge has no store it still falls back to fabric. For signatures, still use `search_*_docs` or `get_minecraft_source` on demand.

Pins: `test-core.mjs` (the 1.20.1 compatibility note / the 1.14.4 and 1.15.2 boundary warning / the 1.12.2 empty-shell warning stays / **S1′ three legs: wiring (on 1.21.1 `StatusEffect` returns a nameIndex with `found:false`), falsification (an invented name must give `exists:false`), disclosure (all three notes required) + no nameIndex on the storeless version 26.1.2 or on the hit path 1.20.1**) and `test-loader-api.mjs` (the compatibility note).

### Doc lookup (Forge / Fabric / NeoForge)

1. **The page ID must be the `id` from the search result**, not a website URL path.
   - Right: `get_fabric_doc_full({ id: "1.20.4/develop_items_first-item", version: "1.20.4" })`  
   - Wrong: `id: "items/first-item"`
2. **Recommended flow**: `search_*_docs` → (optional) `get_*_doc_summary` → `get_*_doc_full`.
3. Search defaults to **hybrid** (see the previous section). Only when it degrades to `l0-only` does it "match index fields only".
4. Prefix query examples: `class:Item`, `event:lifecycle`.
5. NeoForge `1.20.1` doc lookups fall back to the Forge 1.20.1 view (compatibility layer); that is expected.
6. If a platform's data pack is not downloaded, the matching list/search returns `PLATFORM_DATA_MISSING` (use `diagnose_data_paths` to confirm).
7. **Run `list_*_versions` / `list_doc_versions` first** and confirm the version exists locally before searching. `search_forge_docs` and `search_docs({ platform: "forge" })` share one set of Forge indexes.
8. **Pick the tool by version** (do not use `query_api` as a stand-in for the official docs):

| Target | Doc search | Vanilla / mappings | Platform API |
|------|----------|----------------|----------|
| Forge **1.12.2** | `search_forge_docs` / `search_docs` (`version=1.12.2`). There is a `data/forge_1.12.2/forge-docs` tutorial tree (e.g. `1.12.2/blocks_blocks`) | **Do not** treat `query_api` as javadoc: that version's extracted data is about 3300 **class-name empty shells**, with `found:true` and `methods:[]`. Use `convert_mapping` for mappings (MCP SRG) | `query_loader_api` / `search_loader_api` (`1.12.2-forge` is indexed, about 1100 classes) |
| Forge **1.7.10–1.11.2** | no tutorial rule tree; falls to `forge_javadoc` / `search_docs`, `semantic: false` | same, class-name empty shells; do not use `query_api` | no loader summaries (`search_loader_api mode=list` reports `noIngest`) |
| Forge **1.13.2** | `search_forge_docs` / javadoc | class-name empty shells | `1.13.2-forge` is indexed |
| Forge **1.14.4 / 1.15.2** | `search_forge_docs` (**semantic store complete**, 1.68MB / 1.32MB, measured `semantic: true` — prefer semantic search for these two) | the `query_api` index is `{}` (0 classes, **a designed boundary** — every response carries a boundary `warning` and points at semantic search, see the "Vector / semantic search" section; class names are quotable verbatim from the doc corpus, verified in sweep103) | `*-forge` is indexed |
| Forge **1.16.5–1.20.4** | `search_forge_docs` | Vanilla is available through `query_api` (real method signatures) | `query_loader_api` or the docs |
| Fabric | run `list_fabric_versions` first; **never** pass off a neighbouring version's wiki as this version's. 26.1.2 has `fabric-docs` only, no wiki | 26.1+ has no `query_api` index | `search_loader_api mode=list`: fabric-api for `1.14.4` / `1.16.5` / `1.17.1` / `1.18.2` / `1.19.4` / `1.20.1` / `1.20.4` / `1.21.1` / `1.21.3` / `1.21.11` / `26.1.2` is **indexed** (do not treat it as a maven 404; **11 versions = the 14 `fabric/*` rule trees minus the thin ones, `1.21.4` / `1.21.8` / `1.21.10`**) |
| Quilt | `search_docs({platform:"quilt"})`; for QSL questions, a Fabric Registry hit is not a hit | same-version Vanilla boundary as the left column | QSL summaries via `mode=list` (e.g. `1.19.4-qsl` / `1.21.1-qsl`) |
| NeoForge | run `list_neoforge_versions` first. `1.20.1` falls back to Forge docs (compatibility layer) | 26.1+ has no `query_api` | several `*-neoforge` versions are indexed |
| LiteLoader / Rift / ModLoader | `search_docs`. LiteLoader/Rift have **hybrid** semantic stores from the official wiki; ModLoader is still **L0-only** | `convert_mapping` / decompilation | the in-repo verification tables remain the authority; not ingested → `PLATFORM_SKIPPED`. With your own jar use `ingest_loader_api` (dryRun by default) |
| Bedrock | `search_bedrock_docs` (carries `docsStatus`) | no Java `query_api` | `validate_addon_manifest` / `validate_bp_json`, not `validate_project` |

9. Query with a class name or a short term (`Block`, `class:RegistryEvent`). On failure, shorten the query or switch to `search_docs`; do not read a crash or an empty result as "this version has no docs".
10. **After editing `mcp-server` source**: run `npm run build`, then **reload MCP in the host**. A running process in Cursor will not swap to the new `dist/` by itself; use `node mcp-server/dist/cli.js` to verify immediately.

### Tool pitfalls (measured, same class of problem)

These are not "the class does not exist in the game" but a wrong index / lookup, or stale docs:

| Symptom | What is actually happening | What the agent should do |
|------|------|------------|
| `search_*_docs` with `constructor` throws `abbr is not iterable` | `ABBREV_EXPAND[query]` hits `Object.prototype.constructor` | already changed to `Object.hasOwn` / `ownGet`. If MCP still crashes → reload the service |
| `get_version_info({version:"constructor"})` returns `undefined。注册流程：DeferredRegister…` | `VERSION_DB["constructor"]` is a Function | an unknown version must report `forgeVersion=unknown`; never apply the 1.20 registration flow |
| `get_migration_guide({route:"constructor"})` returns `found:true` | free-string lookup in `MIGRATION_GUIDES[key]` hits a Function | now `ownGet`; it must return `found:false` |
| `get_workflow_template({name:"constructor"})` | the MCP schema makes the workflow name an **enum** (Zod rejects it directly); the function layer still needs `ownGet` | do not read a validation failure as "there is no workflow system" |
| `query_api` on 1.12.2 `Block` returns `found:true` | about 3313 class names, almost all with `methods:[]` | read `warning` / `notes`; switch to `search_forge_docs` / `query_loader_api` |
| `generate_datagen` with platform=forge version=1.12.2 emits Java | 1.12.2 has **no DataGen**; the old template even emitted 1.21's `ResourceLocation.fromNamespaceAndPath` | Forge **1.20.1** (`Consumer<FinishedRecipe>`) and **1.20.4** (recipe only, `buildRecipes(RecipeOutput)`); NeoForge 1.20.1 → use `search_neoforge_docs`, 1.20.4/1.20.6 recipe only, 1.21.x and 26.1; **Fabric** 1.21.1/**1.21.3**/1.21.4/1.21.8/1.21.10/1.21.11 and 26.1 (**no 1.21.5**); **Quilt has none** (switch to `search_docs platform=quilt` + write it by hand over the Fabric overlay); other versions return an error |
| `get_version_info` 1.12.2 action=register still teaches DeferredRegister | gotchas says "unsupported" but the recommendation forcibly appends the 1.20 flow | 1.12.2 registration is `RegistryEvent.Register<T>` |
| `search_loader_api` returns empty for Fabric 1.14.4 etc. | docs used to say maven 404 / `LOADER_API_NOT_INDEXED` | trust `mode=list`; `skipped-ingest.json`'s `mavenNotIndexed` is now an empty array |
| docs return `semantic: false` or a warning containing `stale` | deliberately L0-only (**ModLoader**'s three versions only), or sqlite lags behind processed/ | read that query's JSON, not just `get_server_status.semanticIndex.modeHint` |

This class of lookup always goes through `ownGet` (`mcp-server/src/utils/own-record.ts`); never write `record[userString]`.

### Measured, not derived: common error codes and "when not to use it" (as of 2026-10-04)

Every `code` below came from a **minimum failing call** on this machine's CLI, not from reading the docs:

| Tool (call shape) | Measured `code` | When not to use it / how to read it |
|---|---|---|
| `activate_platform_pack action=session` (version not indexed) | `PACK_NOT_FOUND` | never substitute a neighbouring version; pick an indexed one, or run `action=list` first |
| `search_forge_docs` / `search_*` (version not indexed) | `VERSION_NOT_FOUND` | run `list_*_versions` first; **not being on the list ≠ upstream has none** (ask upstream with `query_upstream_releases`) |
| `query_api` (no extracted index for that version) | `DATA_UNAVAILABLE` (`found:false`) | 26.1+ / 1.14.4 / 1.15.2 have no index; switch to semantic search or `get_minecraft_source` |
| `diagnose_gradle` (missing `--project`) | `INVALID_INPUT` | the project path is required; Rift / BaseMod / Bedrock still bail out early |
| `generate_lang` / `get_minecraft_source` (missing required field) | `MISSING_REQUIRED` | fill in the required fields first; this is not "the tool is broken" |
| `check_dependencies` (no project / no known libraries) | `ok:false` + `detectedLibraries: []` | **an empty array ≠ no dependencies** — libraries it does not know will be missed (heuristics, not a full Gradle resolution) |
| `crash_analyze` (missing version) | `VERSION_REQUIRED` | pass the version; it only covers the log excerpt you pasted |
| `detect_mod_project` (no `projectPath`, env unset) | `PROJECT_ROOT_REQUIRED` | set `MC_SKILL_PROJECT_ROOT` or pass `--project` first; pointing at the knowledge base root gives `KNOWLEDGE_REPO_NOT_MOD` |
| `generate_worldgen` (invented version `1.99.9`) | `INVALID_INPUT` (`errorKind: usage`) | rejected outright by the two-ended version sentinel, never generated quietly; the docs say this case names `WORLDGEN_MAX_MINOR_1X` |
| `localize_mod` / `port_project` / `query_loader_api` / `generate_lang` / `analyze_mod_jar` / `resolve_lib_skills` / `get_method_params` / `get_version_info` / `search_fabric_docs` / `list_doc_versions` / `search_docs` / `query_registry` (missing required fields) | `MISSING_REQUIRED` | fill in the required arguments first; this is not "the tool is broken". **Measured across 12 tools, the missing-argument shape converges on this single code** |
| `search_mod_code` (no `jarPath` / `decompiledDir`) | `INVALID_INPUT` | run `decompile_mod_jar` first (or point at an existing decompiled directory), otherwise `NOT_FOUND` |
| `get_workflow_template` (unknown template name) | `INVALID_ENUM_VALUE` | the workflow name is an enum and Zod rejects it directly; take names from that tool's list, never guess |
| `convert_mapping` (target layer missing on that version) | `DATA_UNAVAILABLE` (`converted: null`) | failures default to `converted:null`; only `allow_fallback` returns the original name, with `fallbackUsed` set (a fake success is forbidden) |

> How to reproduce: `node mcp-server/dist/cli.js <tool> <minimum failing args>` and read `ok` / `code` / `errorKind` from the response. **Tools that were not measured get no code here** — see the "`—` = not recorded in this repo" note under the §6b / §9 / §11 tables.

### Error-code coverage for all 86 tools (as of 2026-10-04; the tool list and its order are whatever `list-tools` says)

Three evidence tiers: **measured** = read from a minimum failing call on this machine via `node mcp-server/dist/cli.js <tool> <minimum failing args>`; **documented** = already named in that tool's row in this file; **not recorded** = neither the repo docs nor a measurement gives it a dedicated code (for failures, read `errors[]` / `error.code` in the response).

| Group | Tools | Error codes | Evidence |
|---|---|---|---|
| Version / index | `activate_platform_pack` · `search_forge_docs` · `query_api` · `detect_mod_project` · `convert_mapping` · `generate_worldgen` | `PACK_NOT_FOUND` (+`PACK_INCOMPLETE`) · `VERSION_NOT_FOUND` · `DATA_UNAVAILABLE` · `PROJECT_ROOT_REQUIRED` (+`KNOWLEDGE_REPO_NOT_MOD`) · `DATA_UNAVAILABLE` (`converted:null`) · `INVALID_INPUT` | measured |
| Required-argument checks | `get_method_params` · `get_version_info` · `search_fabric_docs` · `list_doc_versions` · `search_docs` · `query_registry` · `localize_mod` · `generate_lang` · `analyze_mod_jar` · `resolve_lib_skills` · `get_workflow_template` | `MISSING_REQUIRED` (11 of them); `get_workflow_template` gives `INVALID_ENUM_VALUE` (the workflow name is an enum) | measured (the missing-argument shape converges on `MISSING_REQUIRED`) |
| Diagnostics | `diagnose_gradle` · `inspect_runtime` · `crash_analyze` | `INVALID_INPUT` · `INVALID_INPUT` · `VERSION_REQUIRED` | measured |
| Index / reverse lookup | `list_forge_versions` · `list_fabric_versions` · `list_neoforge_versions` · `mixin_analyze` · `lookup_obfuscated` · `query_loader_api` · `search_loader_api` · `ingest_loader_api` | `PLATFORM_DATA_MISSING` · `CACHE_MISS` · `UNOBFUSCATED_NO_YARN` · `PLATFORM_SKIPPED` · `LOADER_API_NOT_INDEXED` · `INVALID_INPUT` | documented |
| Porting / writing | `analyze_porting_path` · `port_project` | `NOT_A_MOD_PROJECT` · `UNSUPPORTED_PORT` · `INVALID_INPUT` · `PROJECT_ROOT_REQUIRED` · `PATH_OUTSIDE_ALLOWLIST` | documented |
| Upstream queries | `query_upstream_releases` | `URL_REJECTED` (plus the two states `ok:false` / `available:false`, which mean different things) | documented |
| In-game playtesting | `playtest_intent` · `playtest_bridge` · `inspect_playtest_evidence` | `CONFIRMATION_REQUIRED` · `INTENT_FORBIDDEN` · `INTENT_NOT_IN_MENU` · `PARAM_NOT_DECLARED` · `MISSING_REQUIRED_PARAM` · `MAILBOX_BUSY` · `MENU_NOT_FOUND` · `PLAYTEST_TIMEOUT` · the three states `present\|absent\|unreadable` | documented |
| Decompilation | `get_minecraft_source` · `decompile_mod_jar` · `download_official_mdk` · `search_mod_code` | `TOOLCHAIN_MISSING` · `NOT_FOUND` · `MDK_NOT_PINNED` · `NOT_FOUND` | documented |
| Generators | `generate_datagen` · `generate_model` · `generate_network_packet` · `generate_capability` · `generate_config` · `generate_entity_renderer` · `generate_addon_manifest` · `generate_bp_entity` · `generate_playtest_driver` | the `resultKind` three states `ok` / `generation_failed` / `write_blocked`; when a write does not complete, `writeError.code` ∈ `CONFIRMATION_REQUIRED` / `PROJECT_ROOT_REQUIRED` / `PATH_OUTSIDE_ALLOWLIST` / `NOTHING_TO_WRITE` / `WRITE_FAILED` | documented |
| **No dedicated code (39)** | `get_server_status` · `validate_project` · `check_dependencies` · `mc_skill_update` · `check_publish_ready` · `list_community_sources` · `search_community_docs` · `get_community_doc_summary` · `get_community_doc_full` · `get_forge_doc_summary` · `get_forge_doc_full` · `get_forge_doc_related` · `get_fabric_doc_summary` · `get_fabric_doc_full` · `get_fabric_doc_related` · `get_neoforge_doc_summary` · `get_neoforge_doc_full` · `get_neoforge_doc_related` · `search_neoforge_docs` · `get_doc_summary` · `get_doc_full` · `get_doc_related` · `diagnose_data_paths` · `search_bedrock_docs` · `get_bedrock_doc_summary` · `get_bedrock_doc_full` · `get_bedrock_doc_related` · `analyze_bedrock_log` · `validate_addon_manifest` · `validate_bp_json` · `audit_resources` · `validate_datapack_json` · `validate_at` · `validate_aw` · `list_knowledge_resources` · `read_knowledge_resource` · `analyze_log` · `analyze_build_log` · `get_migration_guide` | **no dedicated code recorded** ⇒ on failure read the response's `errors[]` / `error.code`; **filling them in from memory is forbidden**. Among these, `get_*_doc_*`, `list_*`, `audit_*`, `validate_*`, `analyze_*` and `read_*` have the three shapes "result / empty result / tool failure", and **an empty result never means the target does not exist** | not measured |

> Coverage rule: this list names all **86** tools (6+11+3+8+2+1+3+4+9+39 = 86). "Not recorded" is not a verdict of absence — it is an honest marker of insufficient evidence. Filling those in requires designing, per tool, a call whose arguments are valid but semantically failing (e.g. handing `get_*_doc_full` a well-formed but non-existent `id`) and measuring it; that is a separate round of work.

### Rule pack loading (`activate_platform_pack`)

The `forge/<ver>/.cursor` tree in the knowledge base is **not** picked up by the IDE of a user's mod project. During coding, use MCP to deliver that version into the **current conversation**; do not copy the rules into the `MC_skill` repo root.

| `action` | What it does |
|----------|------|
| `list` | the platforms / versions already indexed |
| `session` | **writes nothing**, does not depend on a project root. Returns that version's `AGENTS.md`, the rule bodies, and a Skill **index** (`name` / `description` / `relPosix` / `absPath`). By default only rules **00 / 01 / 09** are injected; `topics` and `task` are **added** to that base (union, never a replacement); `skillNames` and the names suggested by `task` are deduplicated and injected as `skillBodies` (8 entries max in total). `topics` never injects Skill bodies. Library Skills do not go into `nextReads`; only an explicit `skillNames` injects library bodies. `includeAllRules=true` pours in the full text of rules 00–10. `ok=true` with a "base only" warning means the pack is usable but the rules were not extended for the task (`rulesMode=base`, with a `next` object). If the pack exists but the 00/01/09 files are missing → `ok:false` + `PACK_INCOMPLETE` (not `PACK_NOT_FOUND`). Library Skills are still read from `knowledge/libs/`. |
| `write` | writes into the **user's mod project** IDE directories. `hosts` is required (`cursor` / `claude` / … / `all`). DryRun by default. Do not use `includeSkills` any more; use `writeSkillStubs` instead (when neither is passed the default is **true**, which writes stubs pointing the agent at the knowledge-base path, not the full Skill text). `includeSkillBodies` writes full bodies. The target must not be this knowledge base (**the entire repo tree is rejected**, including version subdirectories). **Breaking change (2026-08)**: when `MC_SKILL_PROJECT_ROOT` is set it is a **hard boundary** — `projectPath` must fall inside it or the call is rejected (`PATH_OUTSIDE_ALLOWLIST`, with `breakingChange: true` and `allowRoot` in the response); before this, `projectPath` could override the env. Migration: point the env at a directory that contains the target project, or use a projectPath inside it. |
| `deactivate` | removes what was written, per the manifest |

You **cannot** toggle Cursor's / Claude's Skill scanner. Reloading MCP will not make entries appear in the settings page.

### Tool boundaries

Doc vector search **cannot** replace Vanilla method signatures. When the index is missing, keep `found:false` / an empty result plus an explanation,

| Situation | What it looks like | What the agent should use instead |
|------|------|----------------|
| `query_api` / `get_method_params` on MC **26.1+** | that version's extracted data has **0 classes** (no Parchment api-index) | `search_neoforge_docs` (must pass version, run `list_neoforge_versions` first) / `search_fabric_docs` (run `list_fabric_versions` first, e.g. 26.1.2); or `get_minecraft_source` / decompilation. The mapping layer returns `UNOBFUSCATED_NO_YARN` |
| `api-index.json` on Forge **1.14.4 / 1.15.2** | a placeholder `{}`; Parchment only exists from about 1.16.5 (the `class-names.json` of `forge_1.8.9` / `forge_1.9.4` is likewise an `[]` placeholder). **Every `query_api` query reports this boundary and recommends `search_forge_docs` semantic search** (sweep104; the doc corpus and semantic store are complete for these two) | query a nearby Vanilla name with `version=1.16.5+`, or rely on the docs / MCP mappings; do not assume full javadoc |
| Fabric **26.1.2** | only `fabric-docs` (few pages), **no** `fabric-wiki` | keep `source` at the default `fabric-docs`; do not pass off 1.21.x wiki as 26.1.2 |
| Forge **1.12.2** | `list_forge_versions` **includes** 1.12.2; there is a `forge-docs` tutorial tree. `query_api` may return `found:true` with `methods:[]` (class-name empty shell) | `search_forge_docs` / `search_docs({platform:"forge", version:"1.12.2"})` → `get_forge_doc_full`. For Forge classes use `query_loader_api`. **Never** treat empty methods as a full signature |
| Forge **1.7.10–1.11.2** | `1.7.10` has a javadoc verification table plus short 00/01/09; other versions land on Javadoc class names with `semantic: false` | treat it as a class-name index; `search_forge_docs version=1.7.10` / `search_docs({platform:"forge"})`. Do not substitute the 1.12.2 / 1.20.1 rules, and do not pretend to pin a 1.7.10 MDK |
| `diagnose_gradle` / `validate_project` | **ForgeGradle + Loom + Neo/MDG**; Rift / BaseMod / Bedrock still bail out early. `validate_project` does real checks for Fabric/Quilt/NeoForge (`passed`/`failed`); LiteLoader/Rift/ModLoader/Bedrock are `skipped`. Bedrock → `validate_addon_manifest` | the Java scan limit defaults to 300 and can be raised with `MC_SKILL_JAVA_SCAN_MAX_FILES` (exceeding it produces a warning saying the check may be incomplete) |
| `get_server_status.updateHint` says an update is available | the check cache may be stale | trust `mc_skill_update action=check`; if `git describe` is already ahead of the Release there is no need to apply |

Agents **must not** read "the tool returned empty / found:false / warning" as "it does not exist in the game or the docs", and must not query the wrong platform's tools and force an answer. For reference:

| Misreading | The actual boundary |
|------|----------|
| `query_api` can look up `DeferredRegister` / Fabric API | **It cannot.** It only holds Vanilla Parchment extracted data (roughly 1.16.5–1.20.4). Platform APIs → `query_loader_api` (platform + minecraftVersion required) or the matching `search_*_docs` |
| `query_api` can look up a Forge **1.12.2** `Block` constructor | **Not** as javadoc. That version has no Parchment method entries: the common shape is `found:true` + `methods:[]` + a `warning` about the empty shell. Switch to `search_forge_docs` / `query_loader_api` / `convert_mapping` |
| `search_forge_docs` erroring or returning empty = that version has no docs | run `list_forge_versions` first. 1.12.2 **does** have a tutorial tree. The query term `constructor` used to crash on a prototype key; that is fixed, and if it still crashes, reload MCP. On failure, shorten the query or use `search_docs({platform:"forge"})` |
| `query_api` `found:false` = the class does not exist | the index lacks that class, the short name is ambiguous (`Handler` will not match `MouseHandler`), or `action.code=DATA_UNAVAILABLE` (no extracted data for that version / the worker is not ready). 26.1+ holds **0** classes; 1.14.4/1.15.2 are empty `{}`. 1.12.2 is an **empty shell** (found may be true). Switch to doc search or `get_minecraft_source` |
| `get_method_params` covers all MC versions | it shares `query_api`'s data source, so the boundaries are the same |
| `get_version_info` works for Fabric/NeoForge | **Forge only** |
| `diagnose_gradle` can fix Loom / NeoGradle | it **covers** ForgeGradle + Loom + NeoGradle/MDG; Rift / BaseMod / Bedrock still bail out early. The liteloader plugin takes the lightweight path |
| `validate_project` can check `fabric.mod.json` | Fabric/Quilt/NeoForge are **really checked**; LiteLoader/Rift/ModLoader/Bedrock remain `skipped`. Use `validate_addon_manifest` for Bedrock |
| `query_registry` can look up a mod's registry names | it only covers vanilla `minecraft:` resource IDs |
| an empty doc search = the data pack is broken | it may be L0 degradation, wrong tags, or no wiki for that version. Check `semantic` / `warning` |
| using a website URL as the `id` for `get_*_doc_full` | you **must** use the `id` from the search result |
| `search_community_docs` can stand in for official APIs | **It cannot.** `links` entries do not fetch the page body |
| `port_project` will modify the user's project | **dryRun** by default; a real write needs `confirmed` + `MC_SKILL_ALLOW_WRITE` + a path inside `MC_SKILL_PROJECT_ROOT` |
| workflows / MCP not running Gradle, not copying jars, not uploading = a missing unattended pipeline | **this is human-in-the-loop by design.** Creativity, performance, and debugging are the user's calls; compatibility trade-offs and API choices may be delegated but must be explained with the "explanation template"; high-risk actions need confirmation first |
| `analyze_porting_path` gives a porting path for any folder | a non-mod directory → `NOT_A_MOD_PROJECT`; LiteLoader / Rift / ModLoader / Bedrock → `UNSUPPORTED_PORT` |
| `generate_*` / `generate_datagen` will write files | by default they **only return a text skeleton plus `suggestedPath`**. An optional write needs `write=true` + `confirmed=true` + `MC_SKILL_ALLOW_WRITE=1` + an absolute `MC_SKILL_PROJECT_ROOT`; the path must be relative to the project root and free of `..`; if any condition is missing you get text only, never a silent write. **Three-state semantics (2026-09-19)**: not passing `write` = **dry-run** (text only, always `ok:true`, `resultKind:"ok"`, and `ok` promises nothing about writing); **generation failure** (e.g. unsupported version/platform) ⇒ `ok:false` + `resultKind:"generation_failed"` (reason in `errors[]`); skeleton produced but the **write did not complete** (missing `confirmed`, or the sandbox refused) ⇒ `ok:false` + `resultKind:"write_blocked"` (CLI `success:false` + exit 1, nothing written, the text preview stays in `result`, and the fine-grained reason is in `writeError.code`: `CONFIRMATION_REQUIRED` / `PROJECT_ROOT_REQUIRED` / `PATH_OUTSIDE_ALLOWLIST` / `NOTHING_TO_WRITE` / `WRITE_FAILED`). `platform`/`loader` and `version` (for datagen/config/capability/renderer) are required; defaulting to forge is forbidden. datagen: **Forge 1.20.1 and 1.20.4** (1.20.4 recipe only), NeoForge 1.20.4/1.20.6 (recipe only)/1.21.x/26.1, **Fabric** 1.21.1/**1.21.3**/1.21.4/1.21.8/1.21.10/1.21.11 and 26.1 (no 1.21.5); Quilt has no generate_datagen (switch to `search_docs platform=quilt`); other Forge versions (including 1.12.2) error out. `generate_capability`: forge=Capability; neoforge only 1.20.4+ Attachment; fabric/quilt → error, switch to CCA |
| `localize_mod` translates to Chinese automatically | **there is no machine translation**, it only marks `needsTranslation` |
| `check_dependencies` = a full Gradle resolution | heuristics + the library catalog; libraries it does not know about will be missed |
| `mixin_analyze deep:true` downloads the MC jar | **it does not.** Not cached → `CACHE_MISS`, run `get_minecraft_source` first |
| `search_mod_code` can search any jar | you must run `decompile_mod_jar` first (or already have a decompiled directory), otherwise `NOT_FOUND` |
| `analyze_mod_jar` returns method bodies | it only parses metadata (toml/json/mixin lists); it does not decompile |
| `convert_mapping` / `lookup_obfuscated` work on 26.1 | they return `UNOBFUSCATED_NO_YARN` (already deobfuscated) |
| `validate_datapack_json` covers every pack_format | it is a trimmed schema, leaning towards **1.20.1 / 1.21.1** |
| `get_*_doc_full` can pull many pages at once | **at most 2 pages**, to avoid context overflow |
| `updateHint.available` = you must update | the cache may be stale; run `mc_skill_update check` first |
| missing 26.2 / 26.1.2 wiki → copy a neighbouring version | **cloning to impersonate a version is forbidden** |
| `DOC_NOT_FOUND` / an empty rule tree → copy a neighbouring version's API | **forbidden.** Keep the unverified stub; this is not an oversight |

Order of preference when writing a mod: platform rules (`AGENTS.md`) → `search_*_docs` (platform APIs) → `query_api` (only indexed Vanilla) → decompilation (when you really need source). Do not run `query_api` backwards to guess Forge event names.

### Tool and network boundaries (boundaries only, no conclusions)

The two items below **cannot be verified locally against the upstream itself** (only the channel can be verified — see the table further down). What is registered here is "what must not be inferred", not "verified as no".

| Boundary | How far it was verified | Inference that is forbidden |
|------|----------------|------------|
| Public-internet reachability can only be verified at the level of **this machine's channel**; it is not a "reachable / not reachable" boolean | the pinned commit of `download_official_mdk`, the Releases used by `mc_skill_update`, and the short example-mod commit hashes pinned in the rules / AGENTS can only be re-verified on a reachable network. Measured 2026-09-06: Node `fetch` returns `TLS_VERIFY_FAILED` for both `raw.githubusercontent.com` and `services.gradle.org` (same ledger: `$MC_SKILL_CACHE/loader-api-summaries/fetch-qsl-last.json`); the **same URL** via `curl.exe --ssl-no-revoke` GET = `200` (719 B / 0.1s), and `services.gradle.org/distributions/…` = `307`; a single `git/trees?recursive=1` call to `api.github.com` timed out at 12s (not re-measured) | **"this machine cannot fetch it" ≠ "the upstream does not exist / the checksum is wrong / that commit is fake"**; and TLS-class failures must **not** be recorded as `NOT_FOUND` or "version missing". Keep such entries marked "unverified", switch networks or ask the user to re-verify locally, and do not replace them with another set of guessed values |
| Bedrock `description.identifier` and other namespaced IDs: length limits and character set | Microsoft Learn only says the ID must be namespaced and gives **no** length limit or allowed character set; the community only offers **advice** such as "lowercase, no spaces or special characters" and "path length is bounded by the host" | **do not treat advice as a hard limit**, and do not assert "unrestricted" just because Learn is silent. `validate_addon_manifest` / `validate_bp_json` do not error on length or character set; when generating IDs take a conservative form per the advice and say that it is a convention, not an official constraint |

Fetch channel matrix (when writing maintenance scripts, pick a leg from this table; do not copy "this machine has no network"):

| Leg | Measured locally | Usage |
|----|----------|------|
| Node `fetch` (github / gradle / maven domains) | always `TLS_VERIFY_FAILED` | must not be the primary leg; a failure must be classified as TLS-class, kept separate from 404 / rate limiting |
| `curl.exe --ssl-no-revoke` GET | `200` / `307` (the only stable leg on this machine) | the primary leg on win32. **A cold first attempt may time out** (measured once at 15s with zero bytes), so it must carry backoff retries |
| `curl.exe --head` | the same URL returned both `502` and `200` across rounds | **never** use HEAD to decide reachability; probe with GET |
| `api.github.com` | `git/trees?recursive=1` timed out in one round | re-verify it on its own before relying on it; do not assume it shares the fate of `raw` |

`scripts/_lib/fetch-with-ua.mjs` encodes this table: `downloadWithFallback({ preferCurl: process.platform === "win32" })`, where the curl leg always carries `--ssl-no-revoke` + a UA and the fetch leg always carries `AbortSignal.timeout()` + a UA; the failure categories in `FETCH_FAILURE` (`TLS_VERIFY_FAILED` / `TLS_REVOCATION_CHECK_FAILED` / `TLS_HANDSHAKE_FAILED` / `RATE_LIMITED` / `NOT_FOUND`) are never mixed.

### Mapping conversion (`convert_mapping` + Yarn)

1. It uses the prebuilt `yarn-mappings.sqlite` (**schema v3, with fields**) and does **lazy point lookups**; loading the whole `yarn-mappings.json` at runtime is **forbidden**.
2. **Support matrix (summary)**:

| Version range               | Data source / era             | Class ↔ class | Method ↔ method                               | Field ↔ field                 | Notes                             |
| -------------------- | --------------------- | --- | ---------------------------------- | -------------------- | ------------------------------ |
| 1.16+ (with Fabric tiny) | `yarn-tiny`           | ✅   | ✅ needs `ownerClass`; for overloads prefer `descriptor` | ✅ `memberKind=field` | `to=mojang` = the short Tiny official name |
| 1.13 Forge           | `tsrg` + MCP CSV      | ✅   | ✅ may carry `ownerClass`                  | ✅ + `fields.csv`     | `joined.tsrg` + CSV            |
| 1.7–1.12 Forge       | `forge-srg` + MCP CSV | ✅   | ✅ may carry `ownerClass`                  | ✅ + `fields.csv`     | `joined.srg` + CSV             |
| 1.14–1.15            | `mcp-csv` (partial)    | ❌   | only the global `searge↔named`                 | global `field_*` only        | **do not pass** `ownerClass`            |

1. `mcp↔parchment` is an identity layer; use `get_method_params` for parameter names.
2. **obfuscated / intermediary layer (T5)**: `obfuscated` = the short Tiny official obfuscated name (`er`), `intermediary` = classes like `method_6032`; `yarn/mcp→obfuscated` has the same value as `to=mojang`, and `obfuscated/intermediary→yarn/mcp` supports **ownerClass-free global reverse lookup** (single tokens from crash logs). `to=mojang` keeps the old behaviour and the notes point you at `to=obfuscated` instead. **26.1+ has no obfuscation layer**: obfuscated/intermediary requests return `UNOBFUSCATED_NO_YARN` (available only for 1.14–1.21.11).
3. **Field lookups**: pass `memberKind: "field"` (with `"auto"` the naming style is inferred); passing `ownerClass` is recommended; 1.14–1.15 only has the global `field_`*`/`searge↔named`. While the schema is still v2 it returns `SCHEMA_FIELDS_UNAVAILABLE` (the sqlite must be rebuilt). CLI: `node mcp-server/dist/cli.js convert --kind field ...`.
4. Failures default to `found:false` and `converted:null`; the transitional parameter `allow_fallback` can return the original name with `fallbackUsed` set (a fake success is forbidden).
5. Build: `cd mcp-server && npm run build:yarn-sqlite` (writes to a local temp first and then copies, to avoid drive-letter I/O problems).
6. **`from=mojang` (looking things up by readable mojmap name) has two tiers of sources**: the first tier is the `official` column in the table above, and for **obfuscated** classes that column holds the short Tiny obfuscated name — only the few classes that were never obfuscated carry a readable full path (measured across 13 versions, 100,985 rows: 100,310 short names / 675 readable paths = 0.67%, e.g. `com/mojang/blaze3d/…`) ⇒ looking up readable names like `Container` / `Level` will always give `found:false`, and **that does not mean the class is missing in that version** (the miss receipt states this). The second tier is the derived comparison table `data/_yarn-mojmap-pairs/` (class-level `obf` / `mojmap` / `yarn` plus FQCNs on both sides, **no intermediary column**); it participates only when `from=mojang` and `to` is `yarn` / `obfuscated`, and a hit carries `fallbackUsed:true` while the notes name the table and its row count; `to=intermediary` is rejected outright and does not fall back to the first tier.

### Workflow templates and knowledge resources (Prompts / Resources + tool fallback)

Cursor's main path is **tools**; the protocol layer still registers Prompts/Resources, and the tool fallback guarantees the same body text stays readable:

| Capability | Tool                         | Notes                                                                                                   |
| ---- | -------------------------- | ---------------------------------------------------------------------------------------------------- |
| Workflow  | `get_workflow_template`    | The authoritative list is the one returned by `get_workflow_template` (including `mc-new-block` / `mc-new-item` / `mc-new-blockentity` / `mc-mixin` / `mc-worldgen` / `mc-config` / `mc-gametest` / `mc-setup-env` / `mc-publish`, same names as the Prompts) |
| Knowledge list | `list_knowledge_resources` | lists the `mcskill://` URIs                                                                                  |
| Knowledge read | `read_knowledge_resource`  | reads the body for a URI                                                                                            |

Common URIs: `mcskill://patterns/README` (→ `community_knowledge/patterns/README.md`), `mcskill://schema/sqlite`, `mcskill://matrix/mixin-support`, `mcskill://version-changes/1.21`, `mcskill://antipatterns/registry`, `mcskill://workflow/<template name>`, `mcskill://community/<authored-id>`. For compatibility notes see [mcp-server/docs/prompts-client-compat.md](./mcp-server/docs/prompts-client-compat.md).

**Additional docs** (under `mcp-server/docs/`): `mixin-support.md` (the bytecode-verification support matrix), `vanilla-registries.md` / `registry-data-source.md` (registry data sources), `mc-skill-update.md` (the self-update mechanism), `prompts-client-compat.md` (Prompt/Resource client compatibility).

### Porting analysis (`analyze_porting_path`)

Platform detection combines source code with build and metadata files (`build.gradle`, `mods.toml`, `fabric.mod.json`, and so on). An empty directory, or one with neither build nor metadata → `ok:false` + `NOT_A_MOD_PROJECT` (not `platform: unknown`).

Output contract: `targetPlatform` is **required** (if unspecified → `INVALID_INPUT`, no silent default); `routeSteps` is always a human-readable `string[]`; the machine-readable hand-off is the parallel `nextSteps[]`, each item `{ text, tool?, args? }`, where `tool` + `args` must be directly callable (required parameters present, no placeholders) — if that cannot be satisfied, only `text` is given. `port_project` continues from `nextSteps`.

### Write operations (`port_project`)

Read-only by default. A real write requires both `MC_SKILL_ALLOW_WRITE=1` and `MC_SKILL_PROJECT_ROOT=<the project root allowed for writes>`, and the target path must fall under that root.

## Data reproduction and distribution

The indexes and text under `data/` are generated by `mcp-server/scripts/`. Large `*.jar` / `*.zip` files are excluded by `.gitignore` by default (with exception rules under `data/**`), so do not assume Git holds every binary.

- Only rebuild data from the official sources the scripts declare.
- Run `cd mcp-server && npm run audit:data`; any `ERROR` means the data pack is not fit for publishing.
- The full data pack can be distributed through the GitHub Release assets `mc-skill-data-full-*.zip` + `SHA256SUMS-*.txt` + `data-manifest.json`.
- If a local original package is lost, re-fetch it; never copy across versions and rename it.

Third-party documentation and mapping licenses are described in [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md).

## Directory conventions

- Platforms are split by `platform/version/` (e.g. `forge/1.20.1/`, `fabric/1.20.1/`)
- Rule files live in `.cursor/rules/`, numbered `00`~`10`
- Every rule contains **constraints** and a **Decision Flow**

## Rule files

| File                     | Topic      | Notes                           |
| ---------------------- | ------- | ---------------------------- |
| `00-project-setup.mdc` | Project structure    | Java / Gradle / version numbers          |
| `01-registry.mdc`      | Registries    | how to register, by version                    |
| `02-block.mdc`         | Blocks      | blocks / block entities / fluids               |
| `03-item.mdc`          | Items      | items / tools / armor / food            |
| `04-entity.mdc`        | Entities      | EntityType / Renderer / Goal |
| `05-events.mdc`        | Events      | picking the event class by scenario                      |
| `06-networking.mdc`    | Networking      | sync need → packet type                   |
| `07-datagen.mdc`       | DataGen | choosing a Provider                  |
| `08-client-server.mdc` | Client/server split     | which side the code goes on                        |
| `09-anti-patterns.mdc` | Anti-patterns     | symptoms and the correct approach                      |
| `10-gui.mdc`           | GUI     | Menu / Screen / Container    |

## Agent Skills (**35** unique Forge names + platform extensions, mirrored to multiple IDEs)

Path example: `forge/1.20.1/.agents/skills/<name>/` (there are also host mirrors under `.cursor` / `.continue` / `.opencode` / `.zcode`). The Wave D skills were once synced with `scripts/_oneoff/propagate-wave-d-skills.mjs` (one-off, do not run again); for daily mirroring use `scripts/sync-skills.ps1 -All`.

> Library Skills (`mc-config` / `mc-geckolib` / `mc-curios` / `mc-patchouli`, etc.) are **not written to disk**: the sources are in the root `knowledge/libs/<group>/mc-<name>/SKILL.md` (`all-platforms` / `fabric-only` / `neo-only` / `forge-only` / `bedrock-only`) and are used per the "library Skill" resolution rules in AGENTS.md; `propagate-wave-d-skills.mjs` and the platform `.cursor/skills` **no longer contain library entries**. Current library sources (scanned 2026-09-24 with `find knowledge/libs -name SKILL.md`): all-platforms 20 + fabric-only 10 + forge-only 2 + neo-only 2 (Curios/KFF mirrors) + bedrock-only 2 = **36 files** / **34 unique skillIds** (the measure: file count = number of `mc-*/SKILL.md` per group; the unique skillId count is **the same 34** whether you deduplicate by directory name or by frontmatter `name:`, and the difference comes from `mc-curios` / `mc-kotlin-for-forge` having one mirror each in forge-only and neo-only). This matches row "② library Skill sources" in §7.5 below and "current list" in `knowledge/libs/README.md`.

| Platform/version | Count | Structure | Notes |
|-----------|------|------|------|
| `forge/1.12.2`–`1.20.4` main versions | **35** | directories (one directory per skill) | 15 core + 19 Wave D + `mc-events` (completed in 2026-08 D-1; 1.7.10 is an honest stub) |
| `forge/1.15.2` / `forge/1.17.1` | **35** / **34** | directories | 1.17.1 has `mc-events` and no `mc-capability` (a different set from 1.20.1) |
| `forge/1.7.10` | **3 rules + 3 skills** | directories | only 00/01/09 + `mc-item` / `mc-registry` / `mc-events` (stub: no rule 05, and the event API is unverified so nothing may be generated) |
| `forge/1.8.9` · `1.9.4` · `1.10.2` · `1.11.2` | **3 rules + 0 skills** | `rules/` only | each of the four has 00/01/09, and `.cursor/skills` **does not exist** ⇒ 0 skills is **by design** (a short rule tree exists only to gate "do not copy modern APIs into early versions"), not an oversight. Measured 2026-09-13 (counting `*.mdc` in `readdir <pack>/.cursor/rules`, counting entries in `.cursor/skills`); substituting the 00–10 rules or the 35 skills of 1.12.2 is forbidden |
| `forge/1.21.1` | **0 rules + 0 skills** (draft) | only `AGENTS.md` + `pack.meta.json` | that directory **has no `.cursor/` at all** ⇒ a session always returns `PACK_NOT_FOUND`, and it is not in `list_forge_versions`. Registered as by design; cloning a new tree to fill in a version number is forbidden, and so is standing in a NeoForge 1.21.1 or Forge 1.20.4 tree |
| `fabric/*` (**14 versions**, identical skeleton counts; 26.1.2 is Mojmap) | **38** | `.md` files (thin versions / 26.1.2 use a directory layout) | 18 base per version (including `mc-fabric-api` / `mc-kotlin` / `mc-cloth-config`) + 19 Wave D + `mc-events` (including **1.21.3** and **26.1.2**, filled in during the 2026-08 review; 26.1.2 is Mojmap, Yarn is forbidden). The thin versions `1.21.4` / `1.21.8` / `1.21.10` have **exactly the same counts — 11 rules + 38 skills — as the other 11 versions** (measured 2026-09-13 (counting `*.mdc` in `readdir <pack>/.cursor/rules`, counting entries in `.cursor/skills`): all 14 fabric versions are 11/38, no exceptions), "thin" refers to the corpus, not the skeleton: those three versions scan **2 files** under `knowledge/` in reality (that version's `common/verified-api-<ver>.md` plus the `version-changes/1.21.x.md` shared by the three; the "1 file" in `pack.meta.json` counts only the version's own `common/` page), while the 7 versions that have `code-patterns/` have **12–13 files** (also measured), and the thin versions **do not ship `code-patterns/`**. The `status:"ready"` in `pack.meta.json` does not contradict this self-description — the criterion is what is measured on disk, not what this sentence claims (the 2026-09-08 ruling "a thin pack is a declaration") |
| `neoforge/<ver>` session index | **follows the version directory** | directories | the root `neoforge/.agents/skills` is **not** the session source; main and thin versions (1.20.6 / 1.21.5 / 1.21.10) have the same named skill set within the version (entity/datagen, etc.), no longer 6. **`neoforge/1.20.1` has only `mc-registry` in this version**; the rest goes through the Forge 1.20.1 overlay |
| `quilt/<ver>` on-disk (rules **4** + skills **3**) | **3** | directories | only the QSL deltas `mc-registry` / `mc-events` / `mc-networking`; entity/gui and the rest continue over the Fabric overlay and are not counted in this version's on-disk numbers. Rules measured 2026-09-13 (counting `*.mdc` in `readdir <pack>/.cursor/rules`, counting entries in `.cursor/skills`): all 10 versions have exactly 4 rules (`00-project-setup` / `01-registry` / `05-events` / `06-networking`), **not** the full 00–10 set; other topics read the same-version Fabric overlay |
| `liteloader/<ver>` (1.8.9 / 1.10.2 / 1.12.2) | **3** | directories | `mc-events` / `mc-gui` / `mc-networking` (LiteLoader-specific wording, not Forge APIs) |
| `rift/1.13.2` | **3** | directories | `mc-events` / `mc-gui` / `mc-networking` |
| `modloader/1.6.4`; `modloader/1.2.5`, `1.5.2` | **2**; **1** | directories | 1.6.4: `mc-item` + `mc-registry`; the others only have `mc-registry` (emitting anything outside the safe-api table is forbidden) |
| `bedrock` | **10** | directories (×7 IDE mirrors) | Script API / manifest / resource and behaviour packs, see `bedrock/.cursor/skills/`; no version pinning, live docsStatus |

| Category           | Skills                                                                                                                           |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| Core           | `mc-registry`, `mc-block`, `mc-item`, `mc-blockentity`, `mc-entity`, `mc-mixin`, `mc-networking`, `mc-datagen`, `mc-capability`, `mc-gui` |
| Content           | `mc-fluid`, `mc-particle`, `mc-sound`, `mc-recipe`, `mc-enchantment`, `mc-potion`, `mc-effect`, `mc-command`, `mc-villager`, `mc-ai`      |
| Rendering / models      | `mc-renderer`, `mc-model`                                                                                                           |
| World / data packs     | `mc-worldgen`, `mc-structure`, `mc-advancement`, `mc-loottable`, `mc-datapack`, `mc-resourcepack`, `mc-dimension`, `mc-weather`         |
| Config / testing / energy | `mc-gametest`, `mc-energy`, `mc-multiblock`                                                                                          |
| Compatibility / doc libraries     | `mc-compat-jei` (knowledge/libs source plus platform-owned copies in forge/1.20.1 and neoforge/26.1, not mirrors); library skills (`mc-config` / `mc-cloth-config` / `mc-yacl` / `mc-geckolib` / `mc-architectury` / `mc-terrablender` / `mc-playeranimator` / `mc-pehkui` / `mc-kubejs` / `mc-balm` / `mc-modern-ui` / `mc-patchouli` / `mc-owo` / `mc-curios` / `mc-kotlin-for-forge` / `mc-trinkets` / `mc-cca` / `mc-polymer` / `mc-text-placeholder` / `mc-satin` / `mc-fabric-language-kotlin` / `mc-libgui` / `mc-lib-catalog` / `mc-author-shared-libs` / `mc-resourceful-lib` / `mc-moonlight-lib` / `mc-caelus` / `mc-spruceui` / `mc-player-ability-lib` / `mc-server-translations` / `mc-impersonate` / `mc-script-ui` / `mc-script-server` = 33 library skills + `mc-compat-jei` = **34 unique skillIds** (**36** source files; scanned 2026-09-25 with `find knowledge/libs -name SKILL.md` = 36, directory names deduplicated = 34, the file-count difference = `mc-curios` / `mc-kotlin-for-forge` have one mirror each in forge-only and neo-only ⇒ the unique skillId count only goes up by one). The measure matches the library-Skill source line under "Project layout", the validate_datapack_json row in "Tool pitfalls", and the query_loader_api row in tool reference §1b of the Chinese README, and "current scale" in `knowledge/libs/README.md`; the previous version of this row said "32 library skills + `mc-compat-jei` = 33 unique (35 source files)" and the ones it omitted were exactly `mc-cloth-config`) → `knowledge/libs`) |

Fabric additionally has `mc-fabric-api`, `mc-kotlin`, `mc-cloth-config`; Forge 1.12.2–1.20.4 and the Fabric main versions all have `mc-events` (filled in during 2026-08 D-1; the thin versions backfilled through `FABRIC_SKILL_DONORS` carry a DONOR_SKILL banner). Code pattern samples live in `community_knowledge/patterns/` (also readable via `mcskill://patterns/README`).

## MCP/CLI TOOLS:86

Service name: `MC-AI-Coding-Assistant-Tool`. Installation and configuration: [AUTO_SETUP.md](./AUTO_SETUP.md), [mcp-server/README.md](./mcp-server/README.md).

Recommended general flow:

1. `diagnose_data_paths` / `list_*_versions` / `get_server_status` to confirm data and versions
2. Docs: `search_*` → `get_*_summary` → `get_*_full` (never load more than 2 full pages at once; the `id` must come from a search result)
3. **Platform APIs** via `query_loader_api` / `search_loader_api` or `search_*_docs`; **Vanilla signatures** only via `query_api` / `get_method_params` (roughly 1.16.5–1.20.4; 1.12.2 is a class-name empty shell; 26.1+ has no index). Rule trees via `activate_platform_pack action=session` (00/01/09 + a Skill index by default, see "Rule pack loading" above)
4. Mappings: `convert_mapping` / `lookup_obfuscated` (26.1+ has no obfuscation layer)
5. Project work: `diagnose_gradle` / `validate_project` / `generate_datagen` / `crash_analyze` / `analyze_build_log` / `inspect_runtime` (log-based). Run the matching checks for Forge/Fabric/Quilt/NeoForge; `validate_project` remains skipped for LiteLoader/Rift/Bedrock
6. Porting: `analyze_porting_path` → (after confirmation) `port_project` (dryRun by default)
7. **Community / library mods**: for practice and library selection → `search_community_docs` (`lib-*` / `library-catalog-2026`; follow `AGENT_USAGE.md`) → read `knowledge/libs/.../SKILL.md` (start with `mc-lib-catalog`); `check_dependencies` shows `detectedLibraries`
8. Workflows / knowledge: `get_workflow_template` / `list_knowledge_resources` → `read_knowledge_resource`

For tool limits and misreadings, see "Tool boundaries" above.

---

### 1. API, mappings, and status (6)

| Tool                  | What it does                                                                                                                                                                |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `query_api`         | Looks up method signatures, parameter names, return types, and javadoc for Vanilla/Parchment classes (loads the extracted index by `version`, **version required**, defaulting to 1.20.1 is forbidden). It does **not** contain Forge-specific classes. Coverage is roughly **1.16.5–1.20.4**. On 1.7.10–1.12.2 you may get `found:true` with `methods:[]`; 1.14.4/1.15.2 and **26.1+** have no usable method index. `found:true` requires an exact FQCN or a unique simple name (e.g. `Item`), and rewrites carry `autoCorrected`; ambiguous substrings such as `Handler` return `found:false` plus suggestions. Use `query_loader_api` for platform loader APIs.   |
| `get_method_params` | Full parameter-name list for a class + method (an optional JNI `descriptor` distinguishes overloads). With several overloads and no descriptor → `found:false` + `ambiguous` + `candidates`. 26.1+ has no index → `DATA_UNAVAILABLE`. |
| `convert_mapping`   | Converts classes / methods / **fields** between **mojang / mcp / yarn / parchment / obfuscated / intermediary** (SQLite **v3**). `memberKind=field`; `to=mojang` gives the short Tiny official name (the same layer as obfuscated); failures default to `converted:null` (`allow_fallback` is optional). **The six layers are not available on every version**: yarn-tiny versions (fabric **1.14.4–1.21.x**) have no MCP/Parchment readable layer, so `to=mcp` / `to=parchment` is rejected outright → `YARN_TINY_NO_MCP_LAYER` (use `to=yarn`, or `query_api` / `get_method_params`); `mcp↔parchment` is an identity layer. **Batch (S3)**: pass up to 50 names in `memberName` separated by commas / semicolons / newlines and get `results[]` plus `batch{requested,found,missing}` in one call (over the limit → `INVALID_INPUT`, no silent truncation; with a single name the output shape is unchanged). **Entry lines (S2)**: `accessLines=true` attaches paste-ready AT / AW lines, where the name layer forks by loader — Forge member lines must use SRG names, NeoForge uses readable names with glued descriptors, and Fabric/Quilt AW entry names and descriptors must sit in the same mapping layer as the project (the header follows `to`: named / intermediary / official); a missing name or descriptor ⇒ `complete:false` and an inline `<TODO…>`, and complete lines feed back into the same parser used by `validate_at` / `validate_aw` (`selfCheckOk`). **The generation surface narrowed (2026-09-26)**: on the AW side only `accessible` entries are produced; the `extendable` / `mutable` / `transitive-*` parallel forms and the two-operand instructions `inject-interface` / `extend-enum` that `validate_aw` accepts are **not generated** (validation ⊃ generation — write them by hand when needed). **SRG member-layer coverage (2026-09-26)**: the six versions Forge 1.16.5 / 1.17.1 / 1.18.2 / 1.19.4 / 1.20.1 / 1.20.4 now have stores built from the trimmed MCPConfig with `mappingEra=mcp-config-srg` (`named` = SRG names: hash-shaped `m_/f_` from 1.17 on, the old `func_/field_` form on 1.16.5), so Forge AT member lines on those six versions get real names; this store only participates when `platform=forge`. neoforge_* / quilt_* still have no member store ⇒ still `<TODO…>`. **Two tiers of sources for `from=mojang` (2026-09-27)**: the first tier is that version's `official` column, which for **obfuscated** classes holds short Tiny obfuscated names (`a` / `fac` / `ccv`) — only the few classes that were never obfuscated carry readable full paths (measured across 13 versions, 100,985 rows: 100,310 short names / 675 readable paths = 0.67%) ⇒ looking up a readable mojmap name such as `Container` / `Level` will always give `found:false`, and that **must not** be read as "the class is missing in that version"; the second tier is the derived comparison table `data/_yarn-mojmap-pairs/` (class-level `obf` / `mojmap` / `yarn` plus FQCNs on both sides, **no intermediary column**), which participates only when `from=mojang` and `to` is `yarn` / `obfuscated`; hits carry `fallbackUsed:true` and the notes name the table and its row count, while `to=intermediary` is rejected outright without falling back to the first tier. |
| `lookup_obfuscated` | Deobfuscates a single token from a crash log (`method_6032` / `er` / `func_110143_aJ` / `field_100013_f`) → a readable Yarn name + ownerClass + descriptor. method → field → class; multiple hits give AMBIGUOUS; 26.1+ returns `UNOBFUSCATED_NO_YARN`. |
| `get_server_status` | API index warm-up status, a `diagnose_data_paths` summary, a descriptor self-check, and **updateHint**; an optional `warmup` preloads a given version. It also returns a **`java`** probe (`node` / `JAVA_HOME` / `version` / `ready` / `hint`, needed by decompilation and remapping). **It reports this machine's Java situation only and does not decide Gradle ↔ JDK matching** (that is `diagnose_gradle`).                                                                                    |
| `get_version_info`  | **[Forge only]** Recommended approach, key changes, gotchas, and the official changelog link for an MC version plus an operation (e.g. "registering a block").                                                                                       |

### 1b. Loader API and platform packages (5)

| Tool | What it does |
| --- | --- |
| `query_loader_api` | Looks up classes and `MethodInfo` in the Forge / NeoForge / Fabric-API / QSL summaries. `platform` + `minecraftVersion` are **required**; there is no 1.20.1 default. It is **not** `query_api`. `found:false` does not mean the class is absent from the game. LiteLoader/Rift/ModLoader have no summaries → `PLATFORM_SKIPPED` (you can `ingest_loader_api`). |
| `search_loader_api` | Substring search over `fqcnIndex` (`limit` defaults to 20, capped at 50). `mode=list` lists indexed versions / skipped ones / the cache overlay. |
| `ingest_loader_api` | Extracts summaries from a jar you supply (LiteLoader/Rift/ModLoader, which the project does not download for you), writing only to the `$MC_SKILL_CACHE/loader-api-summaries` overlay; **writing into the repo's `data/` is forbidden**. `jarPath` (absolute) + `mappingsVersion` are required. DryRun by default. Do not use `--file`. **When a platform has several candidate artifacts, use `library` to pick the key** (2026-09-28): the candidate keys for `platform=fabric` are `<ver>-fabric-api` (the API library) and `<ver>-fabric` (the loader itself), and the write side used to take the first candidate unconditionally ⇒ **passing a fabric-loader jar without `library=fabric` overwrites that version's API summary**; a suffix that is not among the candidates ⇒ `INVALID_INPUT` listing the candidates, with no guessing and no new key names. |
| `detect_mod_project` | Read-only detection of a mod project (Quilt is checked before Fabric). `projectPath` (CLI `--project`) takes precedence over `MC_SKILL_PROJECT_ROOT`. The knowledge base root, or a version's `scaffold` → `KNOWLEDGE_REPO_NOT_MOD` (Architectury's version-less `forge/`+`fabric/` with no `pack.meta.json` is not a false positive). No matching rule tree → `PACK_NOT_FOUND`; a neighbouring version's 00–10 is forbidden. |
| `activate_platform_pack` | `list` / `session` / `write` / `deactivate`. A session writes nothing and does not depend on a project root: rules **00/01/09** by default plus a Skill **index** (`topics`/`task` add to the union; `skillNames` injects bodies, 8 max; see "Rule pack loading" above). `write` is dryRun by default and `hosts` is required. Do not use `includeSkills` any more; use `writeSkillStubs` (default true, stubs only); `includeSkillBodies` writes full bodies. The target must be a user's mod project (the knowledge base root is rejected). You **cannot** toggle an IDE's scanner. |

### 2. Project helpers (7)

| Tool                 | What it does                                                                                                                                                                     |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `diagnose_gradle`  | Checks `build.gradle` / `gradle.properties`: ForgeGradle + Fabric/Quilt Loom + NeoGradle/ModDevGradle. On 26.1, Loom must be `net.fabricmc.fabric-loom`, Java 25, and `modImplementation` is forbidden. The liteloader plugin takes the lightweight path. Rift / BaseMod / Bedrock still bail out early.    |
| `generate_datagen` | Emits DataGen Provider templates. **`platform` and `version` are required.** **Forge 1.20.1 and 1.20.4** (1.20.4 recipe only, `buildRecipes(RecipeOutput)`), NeoForge 1.20.4/1.20.6 (recipe only)/1.21.x/26.1, **Fabric** 1.21.1/**1.21.3**/1.21.4/1.21.8/1.21.10/1.21.11 and 26.1 (no 1.21.5). Quilt has no generate_datagen — switch to `search_docs platform=quilt`. Other Forge versions return an error. `modId` and `targetName` are required. |
| `crash_analyze`    | Parses a full crash report (or reads a file via `crashReportPath`), infers `crashKind` (including `fml` / `client` / `server` / `fabric` / `quilt` / `liteloader` / `rift` / `modloader`), likely causes, missing prerequisites / version incompatibilities, and `logHints`. Prefer this over blind web searching; the practice classification can be combined with the community tool.                                                                                              |
| `validate_project` | Forge: mods.toml / DeferredRegister. Fabric/Quilt: `fabric.mod.json` / `quilt.mod.json` + entrypoints. NeoForge: `neoforge.mods.toml`, `@Mod` + `IEventBus`. LiteLoader/Rift/ModLoader/Bedrock are `skipped`. Broken recipes only produce a warning. The Java scan limit is 300 by default (`MC_SKILL_JAVA_SCAN_MAX_FILES`). |
| `check_publish_ready` | Pre-publish checklist: license/version, whether `build/libs` looks like a real release jar, and it reads the checklist in `community_knowledge/authored/publishing.md` (missing items only produce warnings). It does **not** upload and does not call CurseForge/Modrinth APIs. |
| `inspect_runtime` | Log-based inspector: it prefers `logsDir`/`crashReportsDir`, otherwise it probes bounded paths such as `run/logs`. Whole-disk scans and JVM attach are forbidden. Reads file tails by default. |
| `resolve_lib_skills` | Resolves the `knowledge/libs` library skill sources by platform + exact MC version (§3.6: group mapping + `platforms`/`mcVersions` filtering); it returns the repo-relative `path` and a `versionsJson` ground-truth hint (read the matching MC version slot before writing coordinates for that library). Same core as the CLI's `lib resolve`; it only resolves and never returns bodies — the AI still reads the source file directly (the file is the usable thing). |

### 3. Forge official docs (5)

| Tool                      | What it does                                                                                                    |
| ----------------------- | ----------------------------------------------------------------------------------------------------- |
| `list_forge_versions`   | Lists the Forge doc versions available locally. Returns `PLATFORM_DATA_MISSING` when there is no data.                                                   |
| `search_forge_docs`     | **Hybrid** search (L0 + semantic RRF; pure L0 when there is no store). `version` is required (run `list_forge_versions` first). Equivalent to `search_docs({platform:"forge"})`. 1.12.2 uses the `forge-docs` tutorials, not `query_api`. Supports `class:` / `event:` / `method:` prefixes, `|` OR, stop-word removal, and tag filtering. Returns page `id` values for the follow-up tools. |
| `get_forge_doc_summary` | L1 summary of a single page: the first paragraph plus section headings / short summaries, to decide whether reading the full text is worth it.                                                                 |
| `get_forge_doc_full`    | Full L2/L2+ text of a single page; `highlight_key=true` by default highlights the 🔴🟠🟢 key passages. **Never load more than 2 full pages at once.**                              |
| `get_forge_doc_related` | Related pages based on the path skeleton, tags, and section keywords.                                                                              |

### 4. Fabric official docs (5)

| Tool                       | What it does                                                                                    |
| ------------------------ | ------------------------------------------------------------------------------------- |
| `list_fabric_versions`   | Lists the local Fabric doc versions (a `fabric-docs` / `fabric-wiki` version counts when it has an index). No data → `PLATFORM_DATA_MISSING`. |
| `search_fabric_docs`     | **Hybrid** search; optional `source`: `fabric-docs` (default) / `fabric-wiki` / `all`. The wiki leans towards beginners; **26.1.2 has no wiki**. |
| `get_fabric_doc_summary` | L1 summary of a Fabric page (source selectable).                                                           |
| `get_fabric_doc_full`    | Full Fabric page text with key-passage highlighting (source selectable).                                                       |
| `get_fabric_doc_related` | Related Fabric pages.                                                                         |

### 5. NeoForge official docs (5)

| Tool                         | What it does                                                                    |
| -------------------------- | --------------------------------------------------------------------- |
| `list_neoforge_versions`   | Lists the local NeoForge doc versions; the main docs default to **26.1** (a 26.2 build has been published, but the official main docs are not split per version and this repo has no 26.2 corpus ⇒ no cloning to impersonate one); **1.20.1** can fall back to Forge data. |
| `search_neoforge_docs`     | **Hybrid** search (DeferredRegister, Data Components, Payload, …); pure L0 when there is no semantic store. **You must pass version** (run `list_neoforge_versions` first). |
| `get_neoforge_doc_summary` | L1 summary of a NeoForge page.                                                     |
| `get_neoforge_doc_full`    | Full NeoForge page text with key-passage highlighting.                                                 |
| `get_neoforge_doc_related` | Related NeoForge pages.                                                       |

### 6. Cross-platform docs (5)

Mirrors the dedicated tools, behind one entry point taking `platform` (`forge` / `fabric` / `neoforge` / `quilt` / `liteloader` / `rift` / `modloader`, **required**). For Bedrock use `search_bedrock_docs` (see §6b).

| Tool                  | What it does                                                         |
| ------------------- | ---------------------------------------------------------- |
| `list_doc_versions` | Lists the versions available for the **given** platform (it never returns all three platforms at once).                        |
| `search_docs`       | Multi-platform **hybrid** search; `source` is accepted for Fabric. Pure L0 without a semantic store; `PLATFORM_DATA_MISSING` when the platform data is missing. |
| `get_doc_summary`   | Multi-platform L1 summary, for deciding whether a page contains what you need. A missing Quilt page falls back to Fabric (`fallback=fabric`); FAPI-only Registry/ItemGroup pages are rejected (ok=false).                                                 |
| `get_doc_full`      | Multi-platform full text. Useful for complete API steps, event lists, and config item lists; `highlight_key` highlights the 🔴🟠🟢 key passages by default. A missing Quilt page falls back to Fabric; FAPI-only pages are rejected and no Registry body is returned.                                                     |
| `get_doc_related`   | Related multi-platform pages, returning the other pages that share the most keywords. On success the JSON root is an array. A Quilt → Fabric fallback is still an array (entries carry `sourcePlatform:"fabric"` / `warning`) and FAPI-only pages are dropped; FAPI-only ids are rejected (ok=false).                                                    |

### 6b. Bedrock Add-Ons (9)

Separate from the Java `search_*_docs` / `validate_project`. Bedrock uses the Learn documentation and pack JSON — no Yarn, no Mixin, no `query_api`.

| Tool | What it does | How to read the result | Error codes |
|------|------|------|------|
| `search_bedrock_docs` | Searches the Microsoft Learn Bedrock documentation (with a lagging `docsStatus`). `limit` may be raised per call (the default measure is unchanged; it only widens the window and does not change ranking or the release-notes demotion, and the difference between the pool size and the widened window is spelled out in `demotion` / `warning`). | lookup: `ok` + `results[]`; **empty ≠ the page does not exist** — read `docsStatus` / `demotion` / `warning` first | — |
| `get_bedrock_doc_summary` | L1 summary of a Bedrock page. | lookup: `ok` + summary; a missing page goes to `ok:false` + `error` | — |
| `get_bedrock_doc_full` | Full text of a Bedrock page. | lookup: `ok` + full text; **at most 2 pages at a time** | — |
| `get_bedrock_doc_related` | Related Bedrock pages. | lookup: `ok` + array; an empty array is not a failure | — |
| `validate_addon_manifest` | Validates an Add-On `manifest.json` (header/modules uuid and version). Not `validate_project`. | validator: the verdict is in `errors[]`; this file records no dedicated three-state name for it, so trust the response's `ok` / `error` | — |
| `validate_bp_json` | Validates behaviour pack entity JSON, etc. | validator: same as above | — |
| `generate_addon_manifest` | Emits manifest JSON text only, no disk writes. | generator: `resultKind` three states, same as §10 (`ok` / `generation_failed` / `write_blocked`) | — |
| `generate_bp_entity` | Emits behaviour pack entity JSON text only, no disk writes. | generator: same as above | — |
| `analyze_bedrock_log` | Triage of the Bedrock content log (`content_log.txt`). **Not** the Java `crash_analyze`. | reader: no match ⇒ empty result ≠ no problem | — |

> How to read the result: `ok:true` = you have a result; `ok:false` = the tool failed (reason in `errors[]` / `error`). **For lookup tools, an empty result never means the target does not exist** (a missing index, semantic degradation, or a tool boundary is always stated). Generators additionally have the `resultKind` three states, see §10.
> A `—` in the error-code column = this repo records no dedicated error code for that tool; the real error is whatever `errors[]` / `error.code` says, and **filling it in from memory is forbidden**.

### 7. Community knowledge base (4)

Separate from the official docs and **not a replacement** for `search_*_docs`. It suits practice work: publishing, crash classification, soft dependencies, machine GUI, library selection. The index holds **110** entries (`authored` 95 / `links` 11 / `permitted` 4, read live from `community_knowledge/indexes/index-l0.json` as of 2026-10-02), of which **48** are `lib-*.md` library-integration notes. Usage rules: [`community_knowledge/AGENT_USAGE.md`](./community_knowledge/AGENT_USAGE.md); topic id quick reference: [`community_knowledge/README.md`](./community_knowledge/README.md).

| Tool                          | What it does                                                              |
| --------------------------- | --------------------------------------------------------------- |
| `list_community_sources`    | Lists the `community_knowledge` entries (permitted / authored / links) with source counts. |
| `search_community_docs`     | Searches the community library; hits carry `sourceKind`, `url`, `summary`. For libraries you can search `lib-curios`, `library-catalog-2026`, etc. |
| `get_community_doc_summary` | Summary of a community entry (including attribution); links give metadata + external URL only.                                    |
| `get_community_doc_full`    | permitted/authored return in-repo Markdown; **links only give the URL and never fetch the page body**.      |

### 7.5 Library mod knowledge system (essays + Skills + the data chain)

Three layers covering "what a library mod is → how to use it → where the data comes from":

**① Community essays** (under `community_knowledge/authored/`, searchable via `search_community_docs`)

- **48 `lib-*.md` files**, grouped by function: config (Cloth / YACL / Fzzy / owo / MidnightLib…), animation (GeckoLib / playerAnimator / Satin), cross-loader (Architectury / Balm / Resourceful / Moonlight), curios (Curios / Trinkets / Caelus), worldgen (TerraBlender), GUI (LibGui / ObsidianUI / Modern UI), data attachment (CCA / PAL), server-side network text (Polymer / Text Placeholder / Server Translations / Impersonate / Pehkui), scripting languages (KubeJS / Kotlin…), recipes (JEI / EMI / REI), and all-in-one packs (Collective / Bookshelf / MaLiLib and 15 more)
- The master catalog `library-catalog-2026` (overview navigation), the dedicated traps file `lib-traps-2026` (8 selection traps), and the recipe integration notes `library-integration` / `library-integration-jei-emi`
- Each file has a "**verified (decompilation check, 2026-08)**" section: the top-level API packages / entry points for the MC version × loader combinations that were decompiled and checked; details follow the official sources

**② Library Skill sources** (under `knowledge/libs/`, used per the "library Skill" rules in AGENTS.md, **not written** into platform directories)

- Five groups: `all-platforms` 20 / `fabric-only` 10 / `forge-only` 2 / `neo-only` 2 (Curios and KFF, mirroring forge-only) / `bedrock-only` 2 = **36** `mc-*/SKILL.md` files (**34** unique skillIds)
- Resolution rules: platform → group mapping (forge→forge-only+all-platforms; fabric/quilt→fabric-only+all-platforms; neoforge→neo-only+all-platforms; bedrock→bedrock-only) plus a second filter on frontmatter `platforms`/`mcVersions`. Router hub: `mc-lib-catalog`

**③ Data chain** (essay frontmatter → script → MCP consumption)

```
authored/lib-*.md frontmatter (+ the library-integration / library-integration-jei-emi navigation notes)
  → mcp-server/scripts/build-library-catalog-from-authored.mjs → library-catalog.ts (50 catalog entries / 2632 verifiedApi keys / officialUrls)
  → scripts/build-lib-manifest.mjs (Modrinth API)→ lib-manifests/all.json (49 slugs / 3,003 version entries; computed as-of 2026-09-25)
  → scripts/batch-decompile.mjs (batch decompilation, sources generated on demand into $MC_SKILL_CACHE, not committed)
  → scripts/merge-verified-api.mjs → write verifiedApi back
  → scripts/build-api-summaries.mjs → lib-api-summaries/ (API summaries for 48 libraries)
  → check_dependencies consumes the catalog + manifest (library recognition / version summary)
```

**The scripts live in two places, both of them** (do not look in only one):

| Script | Location |
|---|---|
| `build-library-catalog-from-authored.mjs` | `mcp-server/scripts/` |
| `build-lib-manifest.mjs` | **`scripts/` (repo root)** |
| `batch-decompile.mjs` | **`scripts/` (repo root)** |
| `merge-verified-api.mjs` | **`scripts/` (repo root)** |
| `build-api-summaries.mjs` | **`scripts/` (repo root)** |

For data locations see the [Decompiled data artifacts](#decompiled-data-artifacts) section.

> The **authoritative source and the re-compute discipline** for these two rules live in [`CONTRIBUTING.md`, "Counting rules for the library data chain"](./CONTRIBUTING.md); this section only gives the live figures and the conclusion.
>
> **Counting rule A (`verifiedApi` keys)**: the denominator is the sum of the top-level `"<gameVersion>/<loader>"` keys of each entry's `verifiedApi` in `mcp-server/src/diagnostics/library-catalog.ts`, **measured as 2632** (re-run on 2026-09-24); the re-check command is `grep -cE '"[0-9][^"]*/[a-z]+": \{' mcp-server/src/diagnostics/library-catalog.ts` (the same number is pinned as `LEDGER.verifiedApiKeys` in `mcp-server/scripts/assert-lib-ownership.mjs`, and that gate goes red if the disk and the pin disagree; the historical hardcoded values 1880 / 1836 / 1830 are all expired, and the 1836 appearing elsewhere in this file is a historical leftover — this line's rule is authoritative).
> **Counting rule B (the library API summary side)**: the denominator is the file count of `mcp-server/data/lib-api-summaries/*.json` plus the total number of their `versions` group keys, **measured as 48 files / 824 groups** (re-run on 2026-09-24); the re-check command is `node -e "const fs=require('fs'),p='mcp-server/data/lib-api-summaries';const f=fs.readdirSync(p).filter(x=>x.endsWith('.json'));console.log(f.length,f.reduce((a,x)=>a+Object.keys(JSON.parse(fs.readFileSync(p+'/'+x,'utf8')).versions||{}).length,0))"`. A and B are **two different denominators** (2632 ≠ 824); substituting one for the other or mixing them is forbidden.
> Version windows appear separately in each entry's `supportedVersions: string[]` (the supported MC version list measured from Modrinth),
> and that is a **different field** from `verifiedApi`'s `gameVersion/loader` keys; the two coexist.

### 8. Porting, data diagnostics, and upstream availability (4)

| Tool                     | What it does                                                                                                                                                                                          |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `diagnose_data_paths`  | Diagnoses the data directory configuration (advanced troubleshooting). Reports the resolved values of `MC_SKILL_DATA` / `MC_SKILL_COMMUNITY`, and whether forge/fabric/neoforge/quilt/liteloader/rift/modloader/bedrock/community are `found` / `empty` / `not_found`. The first stop for troubleshooting.                                                                   |
| `analyze_porting_path` | Scans the project, identifies the platform/version/mappings/Architectury, and outputs risks, `routeSteps`, reference links, and suggested `query_api` calls. **`targetPlatform` is required** (silently defaulting forge→neoforge is forbidden; missing → `INVALID_INPUT`). `routeSteps` is a human-readable `string[]`; the machine-readable hand-off is `nextSteps[]` (`tool` + directly callable `args`). LiteLoader / Rift / ModLoader / Bedrock → `UNSUPPORTED_PORT`.                                                                                                               |
| `port_project`         | Executes porting steps: `init_architectury` / `extract_common` / `apply_version_migration`. **dryRun** by default; a real write needs `dryRun=false` + `confirmed=true` + `MC_SKILL_ALLOW_WRITE=1` + a path inside `MC_SKILL_PROJECT_ROOT`. |
| `query_upstream_releases` | Asks an **upstream release source** whether a loader / mapping / mod version exists at all, and what the latest build is. `source` has seven options: `forge` / `neoforge` (maven-metadata.xml, fully queryable), `fabric-loader` / `fabric-yarn` / `quilt-loader` / `parchment` (endpoints are split per MC version, so **`minecraftVersion` is mandatory**; parchment's artifact name is `parchment-<mc>` and its version string is a date such as `2023.09.03`), and `modrinth` (`slug`, any third-party mod or library). **Difference from `list_*_versions`**: those list the doc versions already ingested by this repo, so not being on the list ≠ the upstream does not have it. The three states must be read: `ok:false` ⇒ nothing was found (network/HTTP/parse) and you **must not** conclude the upstream lacks it; `ok:true` + `available:false` ⇒ the upstream really does not have it. `matchRule` echoes the version-matching rule (e.g. for neoforge: MC 1.21.1 → prefix `21.1.`). `releases` is truncated by version, descending, to `limit` (default 12); the total is in `total`; releases sort before same-number nightlies. **Requires network access**; when Node hits a TLS failure it falls back to `curl.exe --ssl-no-revoke` automatically and does not touch the system certificate store; both the entry point and the redirect landing point must pass the host allowlist (parchment's hosted backend `ldtteam.jfrog.io` is explicitly registered), and a landing point outside the allowlist reports `URL_REJECTED` without reading the body. The first tool in the repo with `outputSchema` + `structuredContent`. **S4′ on-disk cache (2026-09-25)**: TTL per state — 6 hours for `available:true` / 2 hours for `available:false` (a negative can be overturned by a new release, hence the short tier) / **no caching for `ok:false`**; the cache root may only be `$MC_SKILL_CACHE/upstream-cache/` (a resolved path inside the repo is refused); the response carries `cache{hit,tier,ttlMs,ageMs?,wrote?,note?}`, `refresh=true` forces a refetch and `MC_SKILL_UPSTREAM_CACHE=0` turns caching off entirely; the cache key includes `source`/`minecraftVersion`/`slug`/`limit`. `outputSchema` declares the `cache` slot in sync. |

### 9. Registry / Mixin / resources (9)


| Tool                                                     | What it does                                                                   | How to read the result                                                              | Error codes        |
| ------------------------------------------------------ | -------------------------------------------------------------------- | -------------------------------------------------------------------- | ----------- |
| `query_registry`                                       | Looks up vanilla resource IDs (`nameLayer: registry_id`); use `convert_mapping` for class/method names. | lookup: `ok` + result; **empty ≠ the ID does not exist** (it only covers `minecraft:`)                | —           |
| `mixin_analyze`                                        | Parses mixins.json and @Mixin injection targets (multiple mapping layers; high risk — see supportMatrix). With `deep:true` it runs bytecode-level verification against the cached remapped client jar (target class / selectors / @At call sites); if the jar is not cached you get a CACHE_MISS pointer (it never downloads on its own). | validator: `ok` + verdict; **a jar that is not cached = a `CACHE_MISS` pointer, not a failure** (run `get_minecraft_source` first) | `CACHE_MISS` |
| `validate_at`                                          | Bytecode-level validation of Forge/NeoForge `*_at.cfg`: class/member existence (inheritance chain / record / inner classes), mapping-layer mismatch suggestions, cross-file conflicts. | validator: the verdict is in `errors[]`; this file records no dedicated three-state name, so trust the response's `ok` / `error`      | —           |
| `validate_aw`                                          | Bytecode-level validation of Fabric `.accesswidener`: header/namespace, entry types, existence, transitive, cross-file conflicts. | validator: same as above                                                               | —           |
| `audit_resources`                                      | Static checks of model texture references, orphan textures, modId naming, etc.                                           | validator: same as above (static surface, not bytecode-level)                                             | —           |
| `validate_datapack_json`                               | Trimmed JSON validation for recipe / loot_table / advancement / tag (on 1.21+ a recipe `result` may be an object; this is not the full pack_format schema).                  | validator: **trimmed schema ⇒ passing does not mean full pack_format compliance**, only that the surfaces listed here were covered | —           |
| `get_workflow_template`                                | Full workflow text (the `get_workflow_template` list is authoritative; same names as the MCP Prompts; a tools-only client such as Cursor uses the fallback). | lookup: `ok` + full text; template names come from that tool's list, not from guessing                     | —           |
| `list_knowledge_resources` / `read_knowledge_resource` | Lists / reads the `mcskill://` URIs (patterns, schema, workflow, community, etc.).          | lookup: `ok` + URI list / body; a missing URI ⇒ `ok:false`                        | —           |

> How to read the result: `ok:true` = you have a result; `ok:false` = the tool failed (reason in `errors[]` / `error`). **For lookup tools, an empty result never means the target does not exist.** Generators additionally have the `resultKind` three states, see §10.
> A `—` in the error-code column = this repo records no dedicated error code for that tool; the real error is whatever `errors[]` / `error.code` says, and **filling it in from memory is forbidden**. The only confirmed code in this group is `CACHE_MISS` (the `mixin_analyze deep` pointer for an uncached jar — a "build the cache first" hint, not an error).

> Counting rule: this group has **9 tools in 8 rows** — the last row merges `list_knowledge_resources` and `read_knowledge_resource`, while the heading "（9）" counts tools.

Bytecode-level verification (`mixin_analyze deep` / `validate_at` / `validate_aw`) depends on the T2 cache pipeline: when the jar is not cached you get a `CACHE_MISS` pointer (run `get_minecraft_source` first), and it **never starts a large download on its own**.
See `mcp-server/docs/mixin-support.md`.

### 10. Code generation templates (9)

The 9 tools in this group **return text + `suggestedPath` only, no disk writes** by default. An optional write requires all of: `write=true` + `confirmed=true` + the environment variable `MC_SKILL_ALLOW_WRITE=1` + an absolute `MC_SKILL_PROJECT_ROOT` (missing ⇒ `PROJECT_ROOT_REQUIRED`); the write path must be relative to the project root and free of `..`, and going out of bounds reports `PATH_OUTSIDE_ALLOWLIST`. If any condition is missing you get text back and nothing is written silently. **Three-state semantics (2026-09-19)**: the default (no `write`) = dry-run, always `ok:true` + `resultKind:"ok"`; a **generation failure** ⇒ `ok:false` + `resultKind:"generation_failed"` (reason in `errors[]`); a **write that did not complete** ⇒ `ok:false` + `resultKind:"write_blocked"` (CLI `success:false` + exit 1, nothing written, the text preview still in `result`, fine-grained reason in `writeError.code`). Counting rule: this group is exactly the 9 items below; **`generate_datagen` (DataGen Provider templates) belongs to §2 project helpers**, not to this group.

| Tool | What it does |
|------|------|
| `generate_model` | Block/item JSON models and blockstate templates. `version` is required; `kind` defaults to `block`, and `kind=item` emits only the item model (no blockstates). |
| `generate_lang` | en_us + zh_cn lang JSON skeletons. `version` is required; the skeleton does not change with pack_format. **An empty `entries` is not silent (2026-09-25 S6-③)**: it stays `ok:true`, but the response carries a disclosure warning plus a machine-readable `emptyEntries:true` ⇒ that is an empty skeleton, not a finished product. |
| `generate_network_packet` | Network packet (C2S / S2C) skeletons, with registration and send/receive boilerplate per platform and version. |
| `generate_capability` | Capability / DataAttachment skeletons. `platform` and `version` are required. forge 1.20.1 (and 1.18.2–1.20.4) Capability; neoforge 1.20.1 uses the same Capability shape, 1.20.4+ uses Data Attachment; fabric/quilt → error, switch to CCA. |
| `generate_config` | Config skeletons. `loader` and `version` are required; defaulting to forge is forbidden. neoforge 1.21+/26.1/1.20.4/1.20.6 use ModConfigSpec; 1.20.1 uses ForgeConfigSpec (Forge-compatible); fabric/quilt emit a minimal Cloth Config skeleton plus a warning declaring the dependency (it is not a redirect to mc-config). The **default for fabric/quilt is always Cloth**; YACL is only an **explicit opt-in** (the `library` parameter is implemented: enum `cloth | yacl`, default `cloth`, and not passing it means Cloth; changing the default is forbidden). **Passing `library=yacl` gives you a structural shell**: apart from the class declaration and verified member names, everything is `// TODO(未核实)`, and you must additionally run `ingest_loader_api` on your own yacl jar before it can compile. Cloth / YACL and other **third-party config libraries are not loader APIs**: to use their method names you must first ingest them with your own jar via `ingest_loader_api` (dryRun by default, writing only to the `$MC_SKILL_CACHE` overlay); until then `query_loader_api` only returns `found:false` and you must leave `// TODO(未核实)`. |
| `generate_entity_renderer` | Entity renderer skeletons. `platform` and `version` are required; fabric/quilt error out directly. |
| `generate_worldgen` | Worldgen JSON skeletons. `platform` and `version` are required, and there are **sentinels at both ends**: 1.x only accepts 1.18.2–1.21.x and 26.x only accepts `26.<n>[.<n>]` (an invented version such as `1.99.9` is always rejected and the error names `WORLDGEN_MAX_MINOR_1X` and points at the raised sentinel exit, instead of generating quietly); `platform=forge` × 26.x is rejected outright (Forge has no 26.x). feature JSON for forge / neoforge; for fabric / quilt only `configured_feature` / `placed_feature` (forge's `biome_modifier` is forbidden). When there is no template, `errors` lists the supported versions. |
| `localize_mod` | Localization: `diff` / `draft_zh` for your own mod, or `extract` / `pack_draft` for a third-party jar. There is no machine translation; unfilled items are marked `needsTranslation`; when there is no `en_us`, another language can be used as the source. |
| `generate_playtest_driver` | Playtest skeletons: `driverMode` defaults to `external_bridge` (bridge action sequences + postconditions + evidence contract); `in_jvm_player_agent` produces a **real executor** on the versions listed in `PLAYTEST_VERIFIED_TIER` (the single source of truth; as of 2026-10-03 it holds **50** entries, including the deobfuscated `fabric` / `neoforge` `26.1` / `26.1.1` / `26.1.2` / `26.2` / `26.3`, plus the seven forge versions `1.13.2`–`1.19.4`) (intent menu + mailbox consumption + typed postconditions + per-intent budget), while versions outside that list get a contract + structural shell. It installs no bridge and launches no game. |

### 11. Log and dependency diagnostics (7)

| Tool                    | What it does                                      | How to read the result                                               | Error codes                                                     |
| --------------------- | --------------------------------------- | ------------------------------------------------------ | -------------------------------------------------------- |
| `analyze_log`         | Parses game / crash log excerpts (reusing the `crash_analyze` classification).    | reader: `ok` + a classification; since it parses an excerpt, the verdict only covers the part you pasted            | —                                                        |
| `analyze_build_log`   | Parses pasted Gradle / javac build failures (it does not execute gradlew); returns the symbols/files and suggested tools. | reader: `ok` + symbols/files + suggested tools; **it does not run gradlew**           | —                                                        |
| `get_migration_guide` | Defaults to the Primer **toc**; `section` returns only that chapter; `full=true` gives the whole text (with url/license/loader). The route may contain a platform or `from->to`. | lookup: the default is toc only (three modes: `toc` / `section` / `full`); **not getting full text does not mean the chapter is missing** | —                                                        |
| `check_dependencies`  | Reports dependency problems from `build.gradle` / `mods.toml` / `fabric.mod.json` / `quilt.mod.json` / `litemod.json` / `riftmod.json` / Bedrock manifests: loader detection (quilt/fabric/forge/neoforge/liteloader/rift/modloader/bedrock), library recognition (catalog wiring), conflict / trap detection. It returns `detectedLibraries` (including the `supportedVersions` decompilation-verified version window and a `manifestSummary` version/loader summary, from `library-catalog.ts` + `data/lib-manifests/all.json`). | lookup: `ok` + `detectedLibraries`; **heuristics + catalog ⇒ libraries it does not know will be missed** (this is not a full Gradle resolution) | —                                                        |
| `inspect_playtest_evidence` | Reads playtest evidence (exit-code / state.json / `[QA]` sections / calls.jsonl / screenshots), each item with the three states `present\|absent\|unreadable`; requires `MC_SKILL_PLAYTEST_ALLOW=1` + `MC_SKILL_PLAYTEST_ROOT` (a realpath hard boundary). It can delegate to `inspect_runtime` to read logs. | **three states**: `present` / `absent` / `unreadable` per item; **a missing item must never be read as "no failure"** | —                                                        |
| `playtest_intent` | The playtest **intent mailbox** (the LLM-side wiring for the `in_jvm_player_agent` real executor): `action=read\|write`; a write creates `<evidenceDir>/intent.json` (the driver's `waitintent` step consumes it and renames it to `intent.done.json`). Check order: confirmed → forbidden list (kill/tnt/fill) → the menu (`intent-menu.json`) → parameter allowlist → required parameters → mailbox occupancy (overwrite overrides it). Requires `MC_SKILL_PLAYTEST_ALLOW=1` + `MC_SKILL_PLAYTEST_ROOT`. Failure codes: `CONFIRMATION_REQUIRED` / `INTENT_FORBIDDEN` / `INTENT_NOT_IN_MENU` / `PARAM_NOT_DECLARED` / `MISSING_REQUIRED_PARAM` / `MAILBOX_BUSY` / `MENU_NOT_FOUND`. | six checks on the write side; **illegal intents are rejected on the write side** and never reach the executor. Three failure shapes: mailbox-level failure = data (guarding continues) / protocol violation = rejected on the write side / script form = judged red and the round stops | `CONFIRMATION_REQUIRED` · `INTENT_FORBIDDEN` · `INTENT_NOT_IN_MENU` · `PARAM_NOT_DECLARED` · `MISSING_REQUIRED_PARAM` · `MAILBOX_BUSY` · `MENU_NOT_FOUND` |
| `playtest_bridge` | Calls the BlackBoxPro bridge (host is always `127.0.0.1`, default port 38081): `status` reads `/status.ready` (in the world); `execute` posts to `/execute` (the native timeout ⇒ `PLAYTEST_TIMEOUT`); `await` polls `query_*` for a condition (the bridge has no `wait_until`). `execute`/`await` require `confirmed=true` + authorization. The bridge has no authentication and binds to all interfaces — use it locally only. | **a timeout is not "no failure"**: the native timeout maps to `PLAYTEST_TIMEOUT` and **must not collapse into "nothing failed"**. `/status.ready` is not trustworthy — judge "in a world" with `query_player_state` | `PLAYTEST_TIMEOUT`                                       |

> How to read the result: `ok:true` = you have a result; `ok:false` = the tool failed (reason in `errors[]` / `error`). **For lookup tools, an empty result never means the target does not exist.** The three genuine three-state surfaces in this section are `inspect_playtest_evidence`'s `present|absent|unreadable`, `playtest_intent`'s three failure shapes, and `playtest_bridge`'s timeout semantics.
> A `—` in the error-code column = this repo records no dedicated error code for that tool; the real error is whatever `errors[]` / `error.code` says, and **filling it in from memory is forbidden**. The 8 codes written in this section are all named values from the repo docs.

### 12. Self-update (1)

| Tool | What it does |
|------|------|
| `mc_skill_update` | Checks / applies **tooling + data** updates for this repo (GitHub Release). `action=check\|apply`; `scope=tooling\|data\|all`; `channel=stable` by default (pre-releases ignored). `apply` is dryRun by default; a real write needs `confirmed=true` + `MC_SKILL_ALLOW_WRITE=1` + `MC_SKILL_PROJECT_ROOT`=**this repo's root**. It returns `filesToOverwrite` / `diskSpace` / `restartRequired`. CLI: `node mcp-server/dist/cli.js update --action check\|apply` (the old positional form `check\|apply` still works, with a migration hint on stderr). Details: [`mcp-server/docs/mc-skill-update.md`](./mcp-server/docs/mc-skill-update.md). |

`get_server_status` also carries `buildStatus` (`buildRequired=true` when src is newer than dist, telling you to run `npm run build` again), `updateHint` (cached from the last check, default TTL 1h), and `pendingRestart`.

### 13. Decompilation and mod sources (5) — T2 Wave C

**Zero downloads by default**: no prewarming, no prefetching; downloads happen only on explicit calls, into `$MC_SKILL_CACHE` (default `%APPDATA%/mc-skill-cache` / `~/.config/mc-skill-cache`), and **never into the project directory**. With `MC_SKILL_SKIP_DOWNLOAD=1` (CI), download-based tools fail honestly with guidance. **Java 17+ is a prerequisite** (VineFlower / tiny-remapper): when it is missing you get `TOOLCHAIN_MISSING` plus Adoptium install guidance, and the process does not crash.

| Tool | What it does |
|------|------|
| `get_minecraft_source` | Downloads, remaps, and decompiles real MC source on demand, returning class source excerpts (supports line ranges / `force` to recompile). 3–10 minutes the first time, under 1s on a cache hit for the same version. |
| `analyze_mod_jar` | Pure-Node parsing of a local mod jar: fabric.mod.json / mods.toml / neoforge.mods.toml, mixins.json references, entrypoints, dependencies, AW/AT. Passing `version` echoes `mcVersionConstraints` + `versionMatch` (match / mismatch / unknown; unverified shapes are not guessed). No Java, zero downloads. |
| `decompile_mod_jar` | Decompiles a local jar on demand with VineFlower → `$MC_SKILL_CACHE/decompiled-mods/<modId>/<version>/`, returning a source tree summary; optional remap (needs a matching MC version). |
| `search_mod_code` | Line-level grep (substring / regex) over already decompiled source, returning file:line hits; entry points are `decompiledDir` or an already decompiled `jarPath`. |
| `download_official_mdk` | Downloads the official MDK zip into `$MC_SKILL_CACHE`. GitHub-pinned commit (checksums in `mcp-server/data/mdk-checksums.json`); `dryRun` by default. Extraction needs unzip / 7z / bsdtar. |

**Version support matrix** (aligned with the 26.x reality):

| Version range | Yarn | Mojmap | Notes |
|---|---|---|---|
| 1.14 – 1.21.11 | ✅ | ✅ | two-step remap (official→intermediary→named) |
| 26.1+ | ❌ (discontinued) | ✅ | deobfuscated, no remap needed |

**Division of labour with `query_api`**: `query_api` / `get_method_params` give **1.16.5–1.20.4 Vanilla** signatures (fast, offline); they do **not** include Forge/Fabric APIs and have **no index for 26.1+**. The source-oriented tools in this section (`get_minecraft_source` / `decompile_mod_jar` / `search_mod_code` / `download_official_mdk`) should only be used when you really need full source or decompilation (they download a lot), and every tool description carries a ⚠️ boundary note.

### Decompiled data artifacts

**Decompiled data that is committed** (consumed by `check_dependencies` and others, usable right after a clone):

| Data | Location | Content |
|---|---|---|
| `library-catalog.ts` | `mcp-server/src/diagnostics/` | **50** catalog entries (48 `lib-*` plus the integration navigation notes) / **2632 verifiedApi keys** (`gameVersion/loader → packages/entrypoints`) + **`supportedVersions`** version windows (the supported MC version list measured from Modrinth, decompilation-verified) + `officialUrls` |
| `lib-api-summaries/*.json` | `mcp-server/data/` | **48** library summaries / **824** version groups (computed live as of 2026-10-02; the old 44 libraries / 12,225 classes / 49,040 methods / about 4MB are stale); per-library cumulative 114,708 public classes / 545,127 method signatures, about **38 MB** on disk. Recompute: the counting basis B below |
| `lib-manifests/all.json` | `mcp-server/data/` | **49** slugs / **3,003** version entries (version numbers / URLs / hashes / loader matrix, generated from the Modrinth API). Re-check (computed as-of 2026-09-25): `node -e "const j=require('./mcp-server/data/lib-manifests/all.json');console.log(j.length, j.reduce((a,e)=>a+e.entries.length,0))"` ⇒ `49 3003` (the older `48 2870` was the first-page snapshot from before the round-44 pagination fix); the nested key is `entries`, and reading `versions` instead computes 0 |

> **`packages` is a heuristic artifact and must not be used as an import reference**: `verifiedApi.<version/loader>.packages` is derived by `scripts/batch-decompile.mjs` from the top-level directories of the decompiled output (the first 3 segments for common TLDs, the first 2 otherwise, and at each level only the first child directory in alphabetical order), so it only answers "which package roots does this library probably live under" and is **not** a copy-pasteable list of full class names. To get to a concrete class name you must go through `query_loader_api` (after the user ingests a jar via `ingest_loader_api`) or check with IDE completion.
> The ownership side already has a hard constraint: `scripts/merge-verified-api.mjs` rejects outright any package name whose root is already attested by another library entry (JiJ-bundled library leakage), and the self-check lives in §S3 of `mcp-server/test-scripts.mjs`.

> **Known gaps (measured, not fabricated)**: of the 50 catalog entries, **6** have an empty `verifiedApi` object (measured 2026-09-13 by brace-matching each entry) — 4 of them are third-party libraries whose jar cannot be fetched: `lib-config-legacy`, `lib-libgui`, `lib-server-translations`, `lib-spruceui-obsidianui`. The root cause: those 4 have an empty `modrinthSlug` in `library-catalog.ts`, and Modrinth `project/libgui`, `project/spruceui`, `project/server-translations-api`, and `project/config-legacy` all return **404** (no such project), so `build-lib-manifest` cannot fetch a version list and `batch-decompile` has no jar to decompile, leaving `verifiedApi` as `{}`. For these libraries, follow each one's `officialUrls` (the GitHub repository); cloning summaries from a neighbouring library or version is forbidden. The other 2 are `authored/lib-traps-2026` (`role: "trap"`) and `authored/library-integration` (a compilation entry), which by design carry no `verifiedApi` and are not gaps.
> Note: `obsidianui` in the `lib-spruceui-obsidianui` entry does exist on Modrinth (200). If a summary is added for it later, the right move is to add `modrinthSlug` to the frontmatter of `community_knowledge/authored/lib-spruceui-obsidianui.md` and re-run the data chain, **not** to hand-edit the generated `library-catalog.ts`.

The decompiled sources themselves (280,000 .java files) are **not committed** (generated on demand into `$MC_SKILL_CACHE`); `search_mod_code` returns `NOT_FOUND` plus a pointer to `decompile_mod_jar` when the sources are missing. Related scripts: `scripts/build-lib-manifest.mjs` (manifest), `scripts/build-api-summaries.mjs` (API summaries), `scripts/batch-decompile.mjs` (batch decompilation), `scripts/merge-verified-api.mjs` (writing verifiedApi back into the catalog).

Also: `registerPrompt` / `registerResource` (workflow and knowledge URIs) are for clients that support prompts/resources; see `mcp-server/docs/prompts-client-compat.md`.
### Workflow templates (MCP Prompts)

Workflow templates are registered through `registerPrompt` (usable by clients that support prompts); tools-only clients such as Cursor use the `get_workflow_template` tool to get the same full text. **There are 49** (counted live from `get_workflow_template`'s enum as of 2026-10-02; this table lists all of them).

These templates are **agent step checklists** (human in the loop): once the creative direction and version trade-offs are settled, they give the retrieval / draft / validation order. There is **no** MCP tool for Gradle, for copying a jar into a game directory, or for uploading a release; `mc-build-mod` / `mc-ingame-iterate` only list steps, which the user runs locally after confirming. The agent does not run Gradle, does not copy mods automatically, and does not upload to stores — high-risk steps say "execute after user confirmation", by design.

| Template name               | Title      | Flow highlights                                                                                                              |
| ----------------- | ------- | ----------------------------------------------------------------------------------------------------------------- |
| `mc-new-block`    | New block workflow  | DeferredRegister registration → BlockItem → model (generate_model) → lang (generate_lang) → loot (generate_datagen) → optional tags/recipe |
| `mc-new-entity`   | New entity workflow  | EntityType + attributes → SpawnPlacement/spawn egg → renderer (generate_entity_renderer) → loot/sounds                                     |
| `mc-new-gui`      | GUI workflow | MenuType + AbstractContainerMenu → Screen registration → per-platform sync (Forge SimpleChannel / NeoForge Payload / Fabric ServerPlayNetworking) |
| `mc-crash-triage` | Crash triage    | analyze_log/crash_analyze → search_community_docs → validate_project + mixin_analyze → diagnose_gradle            |
| `mc-port-mod`     | Port a mod    | analyze_porting_path → confirm the target → port_project dryRun → get_migration_guide                                           |
| `mc-build-mod`    | Mod build flow  | validate_project / diagnose_gradle → gradlew build **after user confirmation** → confirm the jar in build/libs; on failure analyse the log; can feed into the real-machine loop |
| `mc-ingame-iterate` | Real-machine test and fix loop | ask for and verify the launcher path (official / HMCL / PCL2 version isolation) → install the jar **after user confirmation** → reproduce → fix → retest. Path conventions are in the template body and in the [HMCL isolation doc](https://docs.hmcl.net/launcher/isolation.html) |
| `mc-ingame-playtest` | In-game playtest (bridge) | preflight (bridge jar/dependency accounting) → `playtest_bridge` (`/execute` + `/status.ready` + `await`) → screenshot/query evidence → `inspect_playtest_evidence` → fix and feed back; execution rights are in "Human-in-the-loop exception: in-game playtest (three channels)" in the root AGENTS.md |
| `mc-localize-mod` | Mod localization | decide own/third_party → `localize_mod` diff/draft or extract/pack_draft → the agent fills in Chinese → self-check; see `authored/localization-lang` |
| `mc-decompile-mod` | Mod decompilation research | locate the jar → `analyze_mod_jar` → `decompile_mod_jar` / `get_minecraft_source` → `search_mod_code` → locate the target class → change proposal → hand off to `mc-build-mod` / `mc-ingame-iterate` |
| `mc-new-item` | New item workflow | that version's 03-item registration → model/lang → crafting (generate_datagen only when a template exists) |
| `mc-new-blockentity` | Block entity workflow | BlockEntityType + block → rendering/sync; GUI hands off to mc-new-gui |
| `mc-mixin` | Mixin workflow | mixin_analyze → bucketing mixins.json → verify mappings |
| `mc-worldgen` | Worldgen workflow | configured/placed feature → biome injection for that version |
| `mc-config` | Config workflow | generate_config (loader+version required) or Cloth Config |
| `mc-gametest` | GameTest workflow | check the docs per platform; never assume Forge 1.20.1 from memory |
| `mc-publish` | Publishing checklist | metadata / build/libs / changelog / license; let the user upload where possible (human in the loop, no upload on their behalf) |
| `mc-setup-env` | Dev environment setup | detect_mod_project → MDK dryRun or the Loom/mapping list; genRuns is run after user confirmation |
| `mc-full-mod` | Full chain for a brand-new mod | only from scratch: setup-env → mc-new-* → build → ingame-iterate → optional localize/publish |
| `mc-networking` | Networking checklist | session task=mc-networking → generate_network_packet (with the version suffix) |
| `mc-capability` | Capability / attachment checklist | Forge/Neo 1.20.1 Capability; Neo 1.20.4+ Attachment |
| `mc-recipe-data` | Recipes and data packs | 07-datagen / mc-recipe / loot / advancement |
| `mc-audio-vfx` | Sounds and particles | mc-sound / mc-particle |
| `mc-commands` | Commands | mc-command |
| `mc-dimension-structure` | Dimensions and structures | mc-dimension / mc-structure |
| `mc-access` | AT / AW | validate_at / validate_aw |
| `mc-bedrock-addon` | Bedrock Add-On | search_bedrock_docs / validate_addon_manifest; no Java 02–10 injected |
| `mc-fluid` | Fluids | 02 + mc-fluid |
| `mc-enchant-potion` | Enchantments / potions / effects | mc-enchantment / mc-potion / mc-effect |
| `mc-energy` | Energy | mc-energy / mc-capability |
| `mc-creative-tags` | Creative tab and tags | 03 |
| `mc-kotlin` | Kotlin mods | 00; check that version's docs |
| `mc-jei` | JEI compatibility | mc-compat-jei |
| `mc-ci-publish-extra` | CI publishing extras | 00; only emits step names (copyable YAML at `community_knowledge/patterns/examples/mod-ci-github-actions.md`), never runs CI and never uploads (human in the loop) |
| `mc-villager` | Villager professions / trades | session task=mc-villager → 04-entity; verify profession/trade signatures against that version's docs, never copy a neighbouring version |
| `mc-multiblock` | Multiblock structures | session task=mc-multiblock → 02-block / 07-datagen; no template means writing the docs by hand |
| `mc-ai` | Entity AI / goals | session task=mc-ai → 04-entity; verify Goal/Brain class names against that version's docs, never copy the 1.12 AI task table into 1.20+ |
| `mc-events-forge` | Forge event system checklist | session task=mc-events-forge → 05-events / mc-events; take the registration-time vs runtime subscription split from that version's 05-events.mdc (≤1.17 onwards); verify class names with search_forge_docs |
| `mc-events-neoforge` | NeoForge event system checklist | session task=mc-events-neoforge → 05-events / mc-events; mod bus (registration time) vs game bus (runtime) per version from that version's 05-events.mdc; verify class names with search_neoforge_docs |
| `mc-events-fabric` | Fabric / Quilt event system checklist | session task=mc-events-fabric → 05-events / mc-events; "register a callback at init vs run runtime logic inside the callback" per version from that version's 05-events.mdc (the thin versions 1.21.4/1.21.8/1.21.10 only have a pointer sentence); the Quilt branch only goes through quilt/<ver>/05-events (QSL has no stable artifact, so a Fabric callback must not be passed off as QSL); verify class names with search_fabric_docs |
| `mc-rendering` | Rendering workflow (BER / custom model loaders / shaders) | The render registration entry point forks by platform + version; a single API name must not be used to cover every version. Confirm platform and exact version first → session (optionally task=mc-new-blockentity / mc-new-entity); presentation layer hands off to `mc-audio-vfx` |
| `mc-profiling` | Profiling workflow | A standalone profiling surface for stutter / memory / time cost; principle "measure before optimizing". This is the full version of `mc-crash-triage` step 5 and `mc-build-mod` step 7 |
| `mc-save-migration` | Save-data structure migration workflow | **Mandatory first step**: before changing save schema, make the user back up the whole world directory and report the backup path. Covers SavedData `.dat`, block-entity / entity / chunk read-write formats, and cross-version old-world compatibility |
| `mc-server-multiplayer-test` | Dedicated server and multiplayer test workflow | Multiplayer-side verification: dedicated server, several clients in one world, state sync, behavior under permissions and latency. Building goes through `mc-build-mod`; single-player real-machine testing through `mc-ingame-iterate` |
| `mc-combat-attribute` | Damage / attributes / combat workflow | Damage types, entity attributes and modifiers, combat numbers. Enchantments / potions / effects go to `mc-enchant-potion`; loot goes to `mc-recipe-data` |
| `mc-multi-loader` | Multi-loader (Architectury) workflow | One source producing Fabric / NeoForge (or Forge) multi-loader builds; build and debug cost doubles, which is a trade-off to confirm with the user first. Changing code in an existing project goes through that platform's session |
| `mc-modpack` | Modpack integration workflow | Turn third-party mods into a runnable pack: dependency closure, load order, conflict triage. No automatic publishing, no downloading or uploading mod files on your behalf |
| `mc-datapack-standalone` | Standalone datapack workflow (no Java code) | Pure datapack: a world `datapacks/` directory or a standalone zip, no `build.gradle`, no Java source. Recipes / loot shipped inside a mod go to `mc-recipe-data` and that platform's session |
| `mc-resourcepack-standalone` | Standalone resource pack workflow | Pure resource pack: `resourcepacks/` or a standalone zip (models / blockstates / textures / lang / sounds / GUI textures). In-mod resources go through that platform's session and rules |

### Knowledge exposure (MCP Resources)

`mcskill://` URIs are registered through `registerResource` (for clients that support resources); the `list_knowledge_resources` / `read_knowledge_resource` tools are the fallback.

**269 resources measured** (counted live via `list_knowledge_resources` as of 2026-10-02; recompute: `node mcp-server/dist/cli.js list_knowledge_resources`). By URI family:

| URI family | Count | Content |
| --- | --- | --- |
| `mcskill://code-patterns/<platform>/<version>/NN-<topic>-patterns.md` | **116** (forge 61 / fabric 49 / neoforge 6) | Code pattern library bodies, split by platform + version; snippet-level patterns the agent reads directly |
| `mcskill://community/<sourceKind>/<id>` | **99** | Readable `community_knowledge/` entries (authored / permitted / links; see "Community practice knowledge" above) |
| `mcskill://workflow/<template>` | **49** | Workflow bodies with the same names as the Prompts (same set as `get_workflow_template`) |
| `mcskill://matrix/mixin-support` | 1 | the mixin_analyze support matrix (SRG/Yarn/Mojang/readable/descriptor shapes) |
| `mcskill://schema/sqlite` | 1 | yarn-mappings.sqlite v2/v3 field reference (**must carry `?version=<exact MC>`**; a bare URI is refused) |
| `mcskill://version-changes/1.21` | 1 | the dedicated 1.21 changes chapter (knowledge base) |
| `mcskill://antipatterns/registry` | 1 | the registry anti-pattern essay |
| `mcskill://patterns/README` | 1 | the code pattern library index (`community_knowledge/patterns/`) |

> `code-patterns` only covers the forge / fabric / neoforge trees (quilt / liteloader / rift / modloader / bedrock have no `code-patterns/` → 0 for that family); 6 of them are `archived` legacy entries — registered by name, but `read_knowledge_resource` returns `found:false` plus an archive note instead of a body.

### Standalone CLI (`node mcp-server/dist/cli.js`, all 86 tools available)

Flags-only (`--key value` / `--key=value` / bare `--flag` → true), output always wrapped as JSON `{success, tool, result|error}`, exit codes 0 = success / 1 = tool error / 2 = usage error. Global flags (not part of any tool schema): `--help`/`-h`, `--version`/`-V` (printed before the tool name, or when the whole command has no tool name; when `--version` follows the tool name it is the tool's own field, while `-V` in that position is treated as an unknown argument and exits 2), `--json` (does not change tool output, kept only for compatibility; it affects how `--help` is rendered in an interactive terminal), `--compact`, `--fail-on-error`, `--quiet` (silences progress lines and heartbeats; errors / warnings / migration hints still print), `--timeout <ms>` (exits 1 on expiry with `errorKind:"timeout"`, and the exit code still stays within 0/1/2), `--project <dir>`, `--file field=path`, `--raw [field]` (that field is passed completely literally; writing it bare disables the global `@` expansion), `--output-format json` (the canonical way to express an output-format intent; the only legal value today, anything else exits 2), `--stdin-json` (reads a whole argument object from stdin as a base, with same-named command-line fields always winning; under a TTY, and when it appears together with `@-` / `=-` / `--file f=-`, it always exits 2); every string field supports file input — `--crashReport @./latest.txt` reads a file, `--crashReport=-` / `@-` reads stdin (once per process), and `--file crashReport=./latest.txt` is equivalent, with single files and `--stdin-json` payloads sharing an ~8MB limit. **With `--fail-on-error`, `found:false` and a non-empty `errors[]` are also promoted to exit code 1**. `--fail-on-error=false` **turns that behaviour off** (do not read writing `=false` as enabling it). Boolean flags only accept `true/false/1/0/yes/no/on/off`; `--flag=junk` is rejected. For the full semantics see §Standalone CLI in [mcp-server/README.md](./mcp-server/README.md):

> ⚠️ **Windows PowerShell 5.1 console pitfall (E-7)**: under a GBK code page, PS 5.1 capturing this CLI's UTF-8 JSON through a pipeline introduces bad control characters that break `JSON.parse`; plain Node `spawnSync` pipeline parsing of the same output is perfectly fine. Consume it from scripts through a Node child process, or run `chcp 65001` first.

```bash
node mcp-server/dist/cli.js status --version 1.20.1            # server status (incl. buildStatus)
node mcp-server/dist/cli.js query --className net.minecraft.world.entity.LivingEntity --methodName getMaxHealth --version 1.20.1
node mcp-server/dist/cli.js convert --from mcp --to mojang --name getHealth --owner net.minecraft.world.entity.LivingEntity '--descriptor=()F'
node mcp-server/dist/cli.js update --action check
node mcp-server/dist/cli.js list-tools                          # schemas for all 86 tools
```

**Generic dispatch (v0.2+)**: besides the commands above, **any MCP tool name can be called directly** (handlers are collected automatically, and missing arguments return the zod validation message):

```bash
node mcp-server/dist/cli.js search_docs --platform forge --query DeferredRegister --version 1.20.1
node mcp-server/dist/cli.js check_dependencies --buildGradle "..." --fabricModJson "{...}"
node mcp-server/dist/cli.js analyze_mod_jar --jarPath <path>
node mcp-server/dist/cli.js get_community_doc_summary --id authored/lib-curios
```

The old positional forms (`query <className>` / `convert ... <memberName>`, etc.) still work; wrap in single quotes in PowerShell when parentheses are involved (e.g. `'--descriptor=()F'`).

---

## Troubleshooting and FAQ

There is no separate FAQ table here — the troubleshooting data already lives in a few dedicated tables, so this is just an **index** to save you scrolling 1200 lines.

**Four high-frequency symptoms**

| Symptom | Check first | Where |
| --- | --- | --- |
| All tools uncallable inside the MCP host | Is `dist/` built? Has the host been **reloaded**? | "Tool not working" below; `AUTO_SETUP.md` |
| `PLATFORM_DATA_MISSING` / a platform's data is empty | Does `MC_SKILL_DATA` point at this repo's `data/`? | `diagnose_data_paths`, or set `MC_SKILL_DEBUG_PATHS=1` |
| Can't find some API / class | It is outside index coverage or the simple name is ambiguous, **not** a proof the class is missing from the game | the misreading table in "Tool boundaries" above |
| The game launched but the driver does nothing | the authorization pair / focus pause / the world's `session.lock` being held | "Second-half loop operational bits" above |

**Jump to the matching dedicated table**

- Tool returns odd results, crashes, args misread → "Tool pitfalls (measured, same class of problem)"
- Unsure what `found:false` / `CACHE_MISS` / empty methods means → the misreading table in "Tool boundaries"
- Fetch / upstream query failures (TLS, timeout, 404, proxy) → "Tool and network boundaries"
- An update installed but nothing changed → `mc_skill_update`'s `updateHint` (TTL 1h) + `get_server_status.buildStatus` (`buildRequired`)
- CLI garbled output / `MODULE_NOT_FOUND` (non-ASCII path) → the PowerShell 5.1 pitfall in "Standalone CLI"
- Playtest: bridge timeout / `scan=0` / world won't load / can't close the client → "verified boundaries" + "operational bits" in the real-machine matrix

**Historical ledgers**: cross-round unresolved issues are in `bugfix_list.md` at the repo root; the batch-by-batch change history is in `mcp-server/CHANGELOG.md`.

### Tool not working (read after cloning)

- **Every MCP tool call fails (server not started)**: `mcp-server/dist/` is unbuilt (dist is not committed). Run `cd mcp-server && npm ci && npm run build` (Node >= 22.5; for Yarn lookups also `npm run build:yarn-sqlite`).
- **`get_server_status` reports `buildStatus.buildRequired=true`**: `src` is newer than `dist`; rebuild with `npm run build`, then **reload MCP in the host** (compiling dist alone is not enough — the host process still runs the old code).
- **A decompilation tool returns `TOOLCHAIN_MISSING`**: Java 17+ is required (VineFlower / tiny-remapper); install Temurin 17+ and restart MCP, or set `JAVA_HOME` per the returned instructions.
- **`search_mod_code` returns `NOT_DECOMPILED`**: the sources have not been decompiled yet (not committed by design); follow the returned instructions to call `decompile_mod_jar` / `get_minecraft_source` first.
- **No MCP client**: use the standalone CLI `node mcp-server/dist/cli.js <tool> --key=value` (all 86 tools are callable).

## Glossary

| Term | Meaning |
| --- | --- |
| Human in the loop (HITL) | High-risk steps stop at a checklist / `dryRun` for user confirmation; see the "Position" section |
| `dryRun` / the three write states | preview (no `write`) / real write (`write+confirmed` + env vars) / blocked (`write_blocked`) |
| The three evidence states | `present` / `absent` / `unreadable`; a missing file **must not** be read as "no failure" |
| `resultKind` | machine-readable outcome for generator tools: `ok` / `generation_failed` / `write_blocked` (the two failures must not be conflated) |
| `total` | **the number of results returned this call**, varies with the `limit` you pass; **not** the total corpus hit count |
| `totalPool` / `truncated` | candidates this facet had before the output window / whether more pages remain |
| `semantic` | whether this retrieval used the semantic index; `false` = degraded to keywords (`stale` = index out of date) |
| `verbatim` | whether a hit is "this identifier appears verbatim in the page body"; a missing field = undetermined |
| `sourceKind` | community entry source: `authored` / `permitted` / `links` |
| `verifiedApi` | per-entry API keys (`gameVersion/loader`) verified in the library catalog |
| `fallback` / `source_version` | on doc fallback: which version the result actually came from / whether fallback occurred |
| first / second half loop | first half = code→build→auto-launch→triage; second half = play in-game→gather evidence→feed back |
| test ladder (L0–L7) | the minimum testing gate before delivery: L0 build → L1 structure and static checks → L2 data → L3 GameTest → L4 in-game smoke → L5 scenario → L6 server / multiplayer → L7 regression; a red lower layer blocks the higher ones, and the floor is the widest one matching what you changed (no evidence means red — see the three evidence states). See "Playtest requirement (delivery gate)" in the root `AGENTS.md` |
| version outside the table | a version not in `PLAYTEST_VERIFIED_TIER`: no real driver is generated for it, **but it still has to be tested** — use the bridge route or play by hand, and state honestly whether it was verified manually or not at all |
| three channels | the authorization channels for playtest execution rights (A repo sandbox / B user dev instance / C third-party bridge) |

## Uninstall and rollback

- **Remove rules / Skills written into a user project**: `activate_platform_pack action=deactivate` (rewrites back per the write manifest); run the `action=write` `dryRun` preview first to see `planned` / `willDelete`.
- **Remove a playtest driver**: delete the driver files plus the `PlaytestQaDriver.register();` call line in the target project per the generated `playtest/REVERT.md`; `git status` should show zero hits (the driver is **never** committed).
- **Remove the CLI / MCP install**: `npm uninstall -g mc-skill` (or delete the bin symlinks); the repo's `mcp-server/` and `data/` can simply be deleted (both live inside the repo and do not touch the user's mod project).
- **Roll back a self-update**: `mc_skill_update` only does git `ff-only` merges, so roll back with `git reset --hard <previous commit>` (tooling) or restore the previous data zip; uncommitted changes block the update (optionally `allowDirty` / `stashDirty`).
- **Cache and temp artifacts**: decompilation / MDK / semantic-model artifacts live in `$MC_SKILL_CACHE` (default `%APPDATA%/mc-skill-cache`); deleting it affects neither the repo nor the user project.

## Phase milestones

| Phase        | Status    | Content                                                    |
| --------- | ----- | ----------------------------------------------------- |
| Phase 1   | ✅ done  | rule sets for Forge / Fabric / NeoForge plus multi-version expansion                   |
| Phase 1.5 | ✅ done  | mod scaffold + validation CLI                                        |
| Phase 2   | ✅ done  | Agent Skills + the code pattern library                                  |
| Phase 3   | ✅ done  | MCP Server (docs + mappings + porting + community + Wave B/C/D extensions + five platforms; the tool count is whatever `list-tools` says) |
| Phase 4   | ✅ done  | knowledge base / anti-patterns / data audit and Release distribution |
| Phase 4.5 | ✅ done  | **Full library mod coverage**: 48 `lib-*` essays + 33 unique library Skills (`knowledge/libs`, 35 source files) + an enhanced check_dependencies + full decompilation (jar count **unverified**, artifacts generated on demand into `$MC_SKILL_CACHE` and not committed; → 1836 verifiedApi keys) + API summaries + manifest + generic CLI dispatch **(this row is the state as of when Phase 4.5 finished ⇒ the numbers are never revised backwards; for current figures scan again: library Skills = 34 unique / 36 source files (see the "Project layout" tree, the "five groups" count row in the "Library mod knowledge system" section below, and "current scale" in `knowledge/libs/README.md`; live scan as of 2026-10-02 via `find knowledge/libs -name SKILL.md` = 36 files / 34 unique skillIds); the current value of the `verifiedApi` key count = 2632 (re-run 2026-09-24, see `knowledge/libs/README.md:75`), and the 1836 in this row is likewise the figure as of that time)** |
| Phase 5   | 📋 partial  | `inspect_runtime` is a log-based inspector (not JVM attach); the fine-tuning dataset is still on hold |
