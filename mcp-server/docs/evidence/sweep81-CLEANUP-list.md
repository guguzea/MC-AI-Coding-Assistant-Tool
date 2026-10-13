# sweep81 · E 批：待删清单（只列不删）+ S4 卫生跟单

- as-of：2026-09-18。**口径**：所有存在性/大小/BOM 均由 `probes/probe-s4-hygiene.mjs` 本机实测（不引台账）。
- 纪律：`data/`、`temp/`、投影残件的清理**一律出清单交用户**，agent 不代删。

## 1. 待删清单（请用户裁定后自行执行）

| # | 对象 | 实测 | 依据 | 建议 |
|---|---|---|---|---|
| — | **.gitignore 防复发（2026-09-18 已落）** | 新增 `/sm-120x.xml`、`/mcp-server/e.check*` 两条（含说明块） | 用户裁定：删除清单里的东西写进 .gitignore | ⚠️ **两项当前均已被 git 跟踪 ⇒ 规则暂不生效**，需先 `git rm --cached -- "sm-120x.xml" "mcp-server/e.check*"`（只移出索引、保留文件）；`_scanbin.*` 已被 `**/_scan*` 命中、`mcp-server-local.zip` 已被 `*.zip` 命中，无需新增；`%TEMP%` 项在仓库外、914 孤儿无法用模式表达（见 §1.5） |
| D-1 | 根 `sm-120x.xml` | **10,255 B**，70 URL 的 Forge sitemap | `git grep sm-120x` 零引用（孤儿）；上轮台账已判 S3 | 删除（无引用者） |
| D-2 | `mcp-server/e.check+'` | **0 B**，`git log --diff-filter=A` → `4d621908 sweep79` 引入 | 误建物（文件名含 `'`，零内容零引用） | 删除 |
| D-3 | `%TEMP%\mcp-gate-poison-*` | **20 个**（台账写 16 ⇒ **已更正**，as-of 2026-09-18） | `test-scripts.mjs` 的投毒夹具未自清（OS 临时目录） | 可清理；**根因**见 §3 |
| D-4 | `data/forge_javadoc/1.12.2/processed/` 的 **914 份孤儿镜像** | 索引器（2026-09-18 重跑）日志逐字：「索引已折叠历史重复件 914（processed 仍镜像 914 份孤儿，等待人工删除）」 | D 批重跑索引后，历史重名双份被折叠，processed 侧残留无索引引用的文件 | **口径已核（见 §1.5）**：必须与 raw 侧 914 份重名件**成对删除**，并同步更新 `assert-corpus-faithfulness` 的 `LEDGER_TREES` 条目；完整清单见 `DELETE-LIST-1.12.2-orphans.txt` |

## 1.5 删除口径核验（2026-09-18 实测，探针 `probes/verify-cleanup.mjs`）

| # | 口径（探针实测） | 结论 |
|---|---|---|
| D-1 | `git grep -F sm-120x`（排除 `data/`）**= 0 命中**；文件在盘 10,255 B | **确认孤儿**，可删（交用户） |
| D-2 | `mcp-server/` 下怪名条目 = `e.check+'`；isFile=true / **size=0** / 引用数 0 | **确认误建物**，可删（交用户） |
| D-3 | `%TEMP%\mcp-gate-poison-*` = **21 个**（台账 16 → 更正；as-of 2026-09-18 复测） | 可清理；根因（test-scripts 夹具未自清）见 §3 |
| D-4 | ✅ **已执行（2026-09-18，用户授权）**：成对删除 **1,828 个**（914 processed 孤儿 + 914 raw ` (2).md`），**0 失败**；删后 `raw=3653 / processed=3653`（与索引引用一致） | 删除前先精确核验成对关系（orphan↔raw(2) 零偏差），清单 `DELETE-1.12.2-{processed-orphans,raw-dupes}.txt` | **台账已同步**：`assert-corpus-faithfulness` 的 `LEDGER_TREES["forge_javadoc/1.12.2"]` 按 RELEDGER 口径改 `raw/proc/noTwin: 4567 → 3653`；语义基线 `files` 同步 3653 |
| 附（本轮已由主控执行） | 仓根 `walk(c` / `{const`（各 **0 B**，mtime 2026-09-18 19:10 / 20:13） | **已删**（源自主控 shell 事故的命令碎片，非仓库产物） |
| 附（性质未核，不擅自删） | 仓根 `_scanbin.js` / `_scanbin.txt` / `mcp-server-local.zip` | 待裁定（本轮无触碰） |

## 2. S4 卫生跟单（本轮处置）

| 项 | 实测 | 本轮动作 |
|---|---|---|
| CI 步骤名 `Release smoke (80 tools)` | `.github/workflows/mcp-server-ci.yml:64` | **已改 81**（与本机 `list-tools` 实测 81 一致） |
| 根 `AGENTS.md` BOM | **有 BOM** | **不改**：15 个脚本读它、当前无 BOM 敏感读者；sweep58 起即如此（非回归）。若要清，须先按「BOM 敏感读者」全量排查 |
| 根 `CONTRIBUTING.md` BOM | **有 BOM** | 同上 |
| `test-scripts.mjs:85-90` 的休眠跳过 | 逐字：`if (existsSync(DEFAULT_DEST_DIR)) { assertLinkForge1204(...) } else { console.log("skip: forge_1.20.4 data not present") }` | **不改**：条件是真条件（抓取产物缺失时不判失败），且**显式打印** skip（非静默）；保留 |
| `src/mdk/index.ts` 复制前「将覆盖 N 个既有文件」预检 | 上一轮已更正机制（覆盖**有意为之**、`cpSync` 已弃用有实测理由） | **不动**（残余项，非缺陷） |
| `test-scripts` 泄漏 `%TEMP%` 夹具 | 20 个残留 | **根因待修**（见 §3），本轮只登记 |

## 3. 根因登记（供门面/测试轮）

- `mcp-server/test-scripts.mjs` 生成 `%TEMP%\mcp-gate-poison-*` 投毒夹具后未清理 ⇒ 每跑一次多若干残留（实测 20 个）。
- 修法建议：把这些夹具的创建/清理收进 `try/finally`，或统一落到 `mkdtempSync` 目录并在 finally `rmSync`。**本轮不改**（属测试脚本改造，与 C 批门面同批处理更合适）。

## 4. 与「禁区」的关系（明确声明）

- 本轮**未**触碰：根 `LICENSE` / `package.json` / `ATTRIBUTION.md` / `THIRD_PARTY_NOTICES.md`、`community_knowledge/permitted/`、dotfile 与 `.gitignore`。
- 本轮**未**删除任何文件（D-1/D-2 只列不删）。
