# 语料来源与抓取史（档案）

> **这是档案，不是必读规范。** 存放根 `AGENTS.md` 里曾长期占位的「来源 / 抓取 / 换源 / 逐档复测 / 建档面读数」叙述。
> 2026-10-09 从根 `AGENTS.md` 逐条搬入，**每条标注原行号，可回溯**；**规范句不在此文件** —— 规则仍留在根纲原处。
> 引用任何读数前先核 as-of，并按对应门现跑重算（门名随条目给出）。

---

## 1. Quilt 侧语料实际形态（换源史）

> 原 `AGENTS.md:111`。as-of 2026-09-21（补抓 + 换源）；判据见根纲同段。

`data/quilt_*` 共 **6 档**带目录 —— `1.18.2` / `1.19.4` / `1.20.1` / `1.20.4` / `1.21.1` / `1.21.11`（第 6 档此前没登记过，别按旧清单以为只有 5 档）。

每档正文 **18 页** = 上游 `QuiltMC/developer-wiki` 的 **15 篇英文页**（取 `wiki/<路径>/en.md` 的 markdown 本体）+ QSL 按分支 README + `quilt.mod.json` RFC + 本档 `qsl-verified`。

**换源原因**：正文源已从 `wiki.quiltmc.org` 的 HTML 换成仓库 markdown —— 该站是 SvelteKit 壳，服务端 `<main>` 只有 ~287 字符，旧抓取器掉进 `body` 兜底后把整棵导航菜单与页脚版权灌进语料、并已进语义索引。

**命中数随语料扩容**（实测 `query="QSL registry key"` @1.21.4 = 11、`query="QSL"` @1.21.2 = 10；更早记账里的 `total 4` 已过期）。`total` 有两个独立成因会动：① 语料扩容；② doc 检索面的 `total` 就是「本次返回条数」，会随传入 `limit` 变 —— 2026-09-27 实测 `search_fabric_docs query=registry @1.21.11` 在 `limit=1/5/20` 下 `total` 得 **1/5/15**，语料一个字没动。

> 判据（留根纲）：只看 `fallback` / `sourcePlatform` / `source_version` 三个字段。

## 2. Fabric 侧 docs 正文的覆盖史

> 原 `AGENTS.md:145`。as-of 2026-09-21（对上游全史逐 commit 核）。

**有 `fabric-docs` 正文的是 7 档**：`1.20.4`(31 页) / `1.21.1`(45) / `1.21.4`(51) / `1.21.8`(67) / `1.21.10`(79) / `1.21.11`(93) / `26.1.2`(100)，页数与上游 `FabricMC/fabric-docs` 的 `versions/<v>/develop` **逐档相等**。

**另 7 档（`1.14.4` / `1.16.5` / `1.17.1` / `1.18.2` / `1.19.4` / `1.20.1` / `1.21.3`）上游从来没有这些版本的 docs 树** —— 该仓全部 492 个 commit（起 2023-12-29）、分支只有 `main` 与 `l10n/main`、tags=0，逐 commit 扫不出 `versions/1.14.4…1.21.3` 任一目录；这 7 档本地目录里只有 `fabric-wiki` 的 7 页 + `failures.json`（记账用）。

⇒ 这 7 档「没有 docs 正文」是**上游没有**，不是抓取漏。

## 3. NeoForge 1.20.1 的取数说明

> 原 `AGENTS.md:171`。

`data/neoforge_1.20.1` 缺失是**按设计**：实测 `search_neoforge_docs version=1.20.1` → `ok:true` + `forgeCompatible:true` + `versionFallback:false` + `sourceNote:"NeoForge 1.20.1 使用 Forge 1.20.1 文档数据（API 语义兼容）"`（走的是 `data/forge_1.20.1`，不是邻近 NeoForge 版冒充）。

## 4. 空洞档逐档复测记录

> 原 `AGENTS.md:116` 的复测史部分。as-of 2026-09-08（逐档复测）、2026-09-13 / 09-24 / 09-27 复跑片段；判据与门见根纲同段与 `test-assistant-gaps.mjs :: A-43`。

实测明细（当时读数，引用前重跑）：

- `1.20.6` 的候选清单 = `1.20.1, 1.20.4`；`1.21.x` 五档的候选 = `1.21.1, 1.21.3, 1.21.4, 1.21.8, 1.21.10, 1.21.11`。
- `search_docs platform=quilt` 对**普通词查询**（实测 `query="registry"`）在这六档一律 `ok:false` + `VERSION_NOT_FOUND` + `fallback:null`（错误载荷里**没有** `total` 字段，只有 `availableVersions` 候选清单）且**不 fallback**。
- QSL 措辞查询（`query="QSL"` / `"QSL registry key"`）在这六档返回 `ok:true` + `fallback:"quilt"` + `source_version:"1.21.1"`（读的是同线已建档语料）。2026-09-24 实测 `query="QSL"` @`1.21.5` 与 @`1.21.2` 均 = 10；更早记账的 `total 4` 已作废。
- `search_docs platform=quilt version=26.1.2` 实测 17 条，读的是 Fabric 26.1.2 语料；A-43 只钉「三件套 + `total ≥ 5` 下界」，**不钉死命中数**（补抓语料必然涨，等式钉会假红）。
- `quilt 26.2` 两侧都拒（session `PACK_NOT_FOUND` + 检索 `VERSION_NOT_FOUND`）。

## 5. 各平台「建档面」读数的出处

> 原 `AGENTS.md:108` / `:142` / `:168` 的方法脚注。

- Quilt：实测 `ls -d quilt/*/` 对 `ls -d data/quilt_*/`（as-of 2026-09-05）。
- Fabric：实测 `ls -d fabric/*/` 对 `ls -d data/fabric_*/` 对 `list_fabric_versions`（as-of 2026-09-05）。
- NeoForge：实测 `ls -d neoforge/*/` 对 `ls -d data/neoforge_*/`（as-of 2026-09-05）。

三条清单一律由 `mcp-server/test-assistant-gaps.mjs :: A-43` 对磁盘实扫钉住 —— 数值以该门现跑为准，任何手抄读数都只是当时的快照。

## 6. 字段名出处的逐档证据

> 原 `AGENTS.md:442` 的证据部分。规则（四档出处怎么读）留在根纲，此处存**逐档证据与复核入口**。

**① 语料逐字**：本仓 `data/**` 上游正文可复核 —— 但只有 `BLOCKS` / `ITEMS` 两个注册表字段名逐字出现（如 `data/forge_1.18.2/forge-docs/1.18.2/processed/concepts_registries.md:24,96`、1.19.4 同名页 `:24,106`）。

**①b 官方构件逐字**（自备 jar 可复核、构件不入库）：1.18.2 的 `ENTITIES` / `BLOCK_ENTITIES` / `SOUND_EVENTS` / `PARTICLE_TYPES` / `CONTAINERS` / `PAINTING_TYPES` / `FLUIDS` 由官方 1.18.2-40.1.80 源码（157 行）＋ 1.18.2-40.3.12 universal jar `javap -p`（41 行 / 注册表字段 32 个）两 build 两机制互证 ⇒ 旧记「② 处方-only」的 `SOUND_EVENTS` / `PARTICLE_TYPES` / `FLUIDS` 与「③ 外部-only」的 `ENTITIES`@1.18.2 **已升到本档**。

**② 处方-only**：只有本档 rules/skills 自撰、无外部出处 —— `forge/1.18.2` 面**现已清空**。

**③ 外部-only**（仓内不可复核）：`ENTITY_TYPES`@1.19.4 靠官方源码 + Forge 40.2.1 javadoc + 1.18.2→1.19 改名时点，本仓无落盘副本；**1.19.4 侧字段名与 1.20.x 的 `MENU_TYPES` 未取证，禁止拿 ①b 外推**。

**④ 证伪（不是未核实）**：`FLUIDTYPES` 与 `FLUID_TYPES`@1.18.2 —— **1.18.2 没有流体类型注册表**，流体走 `FLUIDS`（`FluidType` + `FLUID_TYPES` 自 1.19 才有）；修法是删 / 改写那些表行，**不是**改名成 `FLUID_TYPES`。

⚠️ **禁止把本档规则行当外部出处（那是循环引证）**：`forge/1.18.2/.cursor/rules/01-registry.mdc:27`、`forge/1.19.4/.cursor/rules/01-registry.mdc:27` 是**处方实况**（而且正是裁定自己改过的行），只能当「现状长什么样」读。

复核入口（需自备 jar + JDK 17+，两条各一行）：

```
unzip -p <forge-1.18.2-40.1.80-sources.jar> net/minecraftforge/registries/ForgeRegistries.java
javap -p -classpath <forge-1.18.2-40.3.12-universal.jar> net.minecraftforge.registries.ForgeRegistries
```

## 7. 相关

- **游玩自测（driver / 桥）的取证史**：`community_knowledge/authored/ingame-playtest-automation.md`（那份是「口径与坑位」的家，进程细节、日期与逐轮取证都归它）。
- 门与基线的实现史：`mcp-server/CHANGELOG.md`（逐批记录）。
- 数据链口径：`CONTRIBUTING.md` §数据链口径。
