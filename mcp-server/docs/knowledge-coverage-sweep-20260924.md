# 知识面覆盖面侦察（A10 / A11 切片）— as-of 2026-09-24

本文件是**登记面**：A10（Forge 注册表字段逐档扫）与 A11（知识面「未 prose 读」覆盖面）本轮**只做了切片**，
产出 = 分母与口径 + 读过的证据行号 + 可疑条目（**已逐条抽样复核，复核结论并入本文**）+ 未读面清单。
下一轮接手时**先读本文 §4 未读面**，不要重跑已覆盖的部分。

> 口径声明：本文所有数字都是 2026-09-24 现跑；子代理交付的报告**一律按未验证处理**，凡本文写「已复核」的才是
> 我亲手复跑过的（列出与子代理不一致之处）。

---

## 1. 本轮用到的分母（现算，修掉两处过期口径）

| 面 | 现算 | 出处 / 命令 | 与旧口径的差异 |
| --- | --- | --- | --- |
| Forge 规则树档位 | **16** | `Get-ChildItem forge -Directory`（1.7.10…1.20.4 共 15 + 1.21.1 draft） | 与记录一致 |
| Forge 语料档位 | **16**（15 个 `forge_<ver>` + `forge_javadoc`） | `Get-ChildItem data -Directory -like 'forge_*'` | **`data/forge_1.21.1` 不存在**（树有、语料无）；`forge_javadoc` 只含 1.7.10–1.12.2 六档 |
| scaffold `.java` | **95**（`*/<ver>/scaffold/**`） | `Get-ChildItem fabric,forge,neoforge,quilt,liteloader,rift,modloader -Recurse -Filter *.java` 过滤含 `scaffold` | **旧记的「62 个」不复现**：任何合理过滤都得不到 62（分平台：fabric 52 / forge 12 / neoforge 16 / quilt 10 / liteloader 3 / rift 1 / modloader 1，含 `neoforge/scaffold/` 无版本目录 1） |
| quilt 语料 | **6 档 × 18 页** | `data/quilt_*`（1.18.2/1.19.4/1.20.1/1.20.4/1.21.1/1.21.11）× 每档 `processed/` 18 个 md | 与记录一致；规则树 10 档、其中 4 档（1.21.3/1.21.4/1.21.8/1.21.10）有树无语料 |

---

## 2. A10 — ForgeRegistries 字段名逐档扫（切片结论）

**字段清单来源（消费面）**：`forge/1.18.2/.cursor/rules/01-registry.mdc:24-31`（8 名）、`forge/1.18.2/.cursor/skills/mc-registry/SKILL.md:48-55`（8 名）、`mcp-server/scripts/assert-forge-1182-registry-consts.mjs:32-42`（6 个 `*TYPES` 形态）、`knowledge/patterns/examples/deferred-block-item.md:7,11`（仅 BLOCKS/ITEMS）。

**逐档逐字命中（已抽核）**：

| data 档 | 命中面 | 证据 |
| --- | --- | --- |
| 1.9.4 / 1.10.2 | 8 名各 1（javadoc 类页） | `data/forge_javadoc/1.9.4|1.10.2/.../ForgeRegistries.md:28-35` |
| 1.11.2 | 9 名各 1（+ENTITIES） | 同上 `:28-36` |
| 1.12.2 | 11 名各 1 | 同上 `:28-38` |
| 1.18.2 | BLOCKS / ITEMS 亲核命中 | `data/forge_1.18.2/forge-docs/1.18.2/processed/concepts_registries.md:24,96` |
| 1.20.1 / 1.20.4 | BLOCKS ×2 / ITEMS ×1 | 各档 `processed/concepts_registries.md:24,50,106` |
| 1.13.2–1.17.1 / 1.19.4 | **未逐档亲跑** | 只能引既有证据文件（见下「风险」） |

**两处 0 命中（可判「本档无原生生成器/字段」，不是「上游没有」）**：`data/forge_1.12.2/.../forgedev.md` 与
`data/forge_1.17.1/.../forgedev.md` 的 `ForgeRegistries\.[A-Za-z_]+` = 0；1.18.2 的 `FLUIDTYPES` / `FLUID_TYPES` = 0
（该档**没有流体类型注册表** ⇒ 只许删/改写那些表行，**不是**改名成 `FLUID_TYPES`，F146 裁定）。

**风险（已闭环，2026-09-25）**：1.18.2 那份「32 字段全分母坐实」的证据此前只在 gitignored `temp/`（`.gitignore:44`），
`git ls-files` = 0 ⇒ **仓内不可复核**；其余档想核同一张表只能重下 jar。
⇒ **已纳管（清尾②）**：抽成 tracked `mcp-server/docs/evidence-forge-1182-registries.md` —— 含 2026-09-25 javap 重跑的
**完整 32 字段名单**（fields=32：29 个直接 `IForgeRegistry` + 3 个 `Supplier`）、jar sha256、双机制复核命令、
四张表与 assert 重签（6→10）的落地状态。

**禁止平推的实证**：1.18.2 用 `BLOCK_ENTITIES`，1.19.4 用 `BLOCK_ENTITY_TYPES`；`ENTITY_TYPES` 仅 1.19+。

---

## 3. A11 — 覆盖面抽读（两个切片 + 一条已复核的硬发现）

### 3.1 已复核的硬发现：quilt「6 档 × 18 页」里 16 页/档是**同一份现行页的拷贝**

- 证据：`data/quilt_1.18.2/.../processed/wiki-armor.md` 与 `data/quilt_1.21.11/.../processed/wiki-armor.md` 逐行比 =
  **181 行 : 181 行，差异行 = 1，且那一行是「抓取时间」**（`2026-09-21T03:12:16.077Z` vs `…:20.690Z`）。
  6 档 `wiki-armor.md` 文件大小全为 8,378 B、SHA256 各不相同（差异即那行时间戳）。
- 含义：`wiki-*.md`（14 篇/档）是**上游未版本化现行页**的 6 份拷贝 ⇒ 「108 页」这个分母里只有 18 页是真正
  版本相关的（`qsl-*` / `quilt-mod-json` / `index-*`）。引用这些页时**必须**按页内自述标注（`wiki-armor.md:3`
  自认「不是该 MC 版本的历史快照」，`:17-38` 还是 1.18 代 Yarn 形状）。
- ~~建议门（下一轮，未做）~~ ⇒ **已建（清尾①，2026-09-25）**：`mcp-server/scripts/assert-quilt-unversioned-wiki.mjs`
  （已挂 `test-scripts.mjs` 真跑/自证两条数组）。判据：① 6 档 × 14 topic 页全在、每页「> 抓取时间」恰 1 条；
  ② 每页「未版本化现行页」警告在册；③ 同 topic 跨 6 档除时间戳行外逐字同（真跑 = 84 页全绿）；④ 双向登记
  （新 wiki 页未三分类即红）。自证 7 例（跨档改写 / 时间戳缺或重 / 警告删 / 未登记页 / 整页缺失 ⇒ 红；正对照绿）。

### 3.2 口径冲突：**子代理报的 G1 不成立（我已复核）**

- 子代理称 `CONTRIBUTING.md:412` 写「14 篇 wiki + 4 篇非 wiki」⇒ 与 `AGENTS.md:59` 的「15 篇英文页」冲突。
- **复核**：`CONTRIBUTING.md` 里 `14 篇|14篇|wiki-\*|英文页` 只有 1 处命中（`:412`），而那条讲的是 `L28`
  （「quilt 每档只有 4 篇自写页 / fabric-wiki 同名 7 页 | 明确不做 + 原因」）——**不是**「14 篇 wiki」。
  ⇒ G1 降级为**未核实**（AGENTS 的「15 篇」是否对，需上游仓库比对，本仓无从判）。

### 3.3 quilt 其余「读过的证据行号」（子代理交付，未经我逐条复核）

- `data/quilt_1.21.1/.../processed/qsl-verified.md:3`：QSL release 停在 `10.0.0-alpha.5+1.21.1`、1.21.1 无正式版构件 ⇒ 全文降级 `// TODO(未核实)`。
- 同档 `:7`：F115 承诺「6 档 processed 与源稿逐字节一致」（生成器 `scripts/index-qsl-verified.mjs` 机械复制）。
- `data/quilt_1.21.11/.../processed/qsl-verified.md:18`：QSL RegistryEvents **本档未打开源码**，禁止把 1.21.1 的 `RegistryEvents#getEntryAddEvent` 冒充本档。
- 5 档（1.18.2/1.19.4/1.20.1/1.20.4/1.21.1）`qsl-verified.md:4` 仍写「该 wiki 是 SPA，入库正文可能只有导航壳」——**与换源后的实况冲突**（1.21.11 的 `qsl-qfapi.md:5-48` 已是完整英文散文体）；子代理列为过期口径（G5），**我未逐档复核**。
- ~~子代理报 G4~~ ⇒ **已核已修（清尾③，2026-09-25）**：缺口比报告更宽 —— **6 档全部**是「18 条目中唯一一条缺 `sha256`」
  （不只 1.21.11；l0/l1/l2 三件同缺，实测 17/18 有 sha）；`fetchedAt` 语义 = 派生件**建立时间**
  （1.21.11 = 2026-09-19 / 其余 5 档 = 2026-08-14），是历史真值，**不追齐**同档抓取日。修法三段：
  `repair-quilt-indexes.js` 增 sha 补齐/纠偏 + `--audit` 升为 rc 判据（6 档各补 1 条：audit 红→绿）；
  根生成器 `scripts/index-qsl-verified.mjs` 补 sha 写入 + 已存在条目刷新（dry-run 幂等验证：全「sha 未变」）；
  门 `assert-qsl-verified-sync.mjs` 加判据④（l0/l1/l2 三方 sha 对账；先红 18 行点名 6 档→修后绿，自证 7 例）。

### 3.4 scaffold `.java` 的 API 名出处（切片，**大面积未核实**）

- **工具边界（本轮最重要的过程发现）**：`search_content` 对 `data/**` 的目录级 grep 实测**恒 0 命中**
  （同目录同文件用具体路径 `read_file` 可读）⇒ **任何按此法核 data 出处的人都会得到假「0 命中」**。
  本轮 scaffold 的 data 侧证据只拿到 2 条直读链：
  1. `quilt/<ver>/scaffold/**/ExampleMod.java:4,8`（`ModInitializer` / `onInitialize(ModContainer)`）→ `quilt/1.18.2/knowledge/common/qsl-verified.md:12`（10 档同文）。
  2. `fabric/26.1.2/scaffold/**/ExampleMod.java:3`（`net.fabricmc.api.ModInitializer`）→ `data/fabric_1.21.10/reference/latest/src/main/java/com/example/docs/ExampleMod.java:14`（`onInitialize` 在同文件 `:41`）。
- 已自带 `TODO(未核实)` 的 5 处（不是静默项）：`fabric/1.16.5|1.17.1|1.18.2|1.21.1/scaffold/**/ExampleModClient.java` 与 `liteloader/1.12.2/scaffold/hybrid/**/LiteModExample.java:16`。
- **灰区（未完成验证，不是已证伪）**：rift / modloader / liteloader / forge / neoforge 各档与 fabric 大部分名字的 data 出处；
  `neoforge/1.21.10/scaffold/**/Config.java:12`（`ModConfigSpec`）与 `.../Client.java:7`（`ConfigurationScreen` / `IConfigScreenFactory`）列为**优先复核名单**。

---

## 4. 未读面（下一轮的入口，别重跑已覆盖的）

1. **quilt 语料正文**：14 篇 `wiki-*` × 6 档 = 84 页正文未 prose 读（拷贝事实已由清尾① 门钉住，但那 ≠ 读过）；`quilt-mod-json.md`（23 KB/档）、`qsl-readme.md`（11–14 KB/档）零行未读；`index-l1/l2.json` 12 个文件未读（sha 面门只查 qsl-verified 一条）。
2. **quilt 规则树**：8 个工具镜像目录（`.claude/.cursor/.continue/.opencode/.pi/.trae/.zcode/.agents`）的 rules/skills 全未读；6 档 `AGENTS.md` 只读了 1.21.11。
3. **A10**：2026-09-25 已跑 6 档（1.13.2/1.14.4/1.15.2/1.16.5/1.17.1/1.19.4）的 registries/forgedev/datagen 相关页共 26 页（结论见 §6.2）；**各档其余 51–67 页仍未核**；`forge/*/.cursor` 仍只亲核 1.18.2。
4. **A11 三面**（2026-09-25 进展）：neoforge `knowledge/**` **19 篇已全读**（§6.3；12 条可疑项里 3 条已亲核）；**`knowledge/**` 其余 ~221 篇未 prose 读**（forge 7 档 / fabric 11 档 / 根 knowledge 等）；约 350 个零命中非空壳 md 未动；转码族**已定位（190 页，非 188）**且抽样 13 页出 8 类差异（§6.4）。
5. **scaffold**：95 个 `.java` 里只抽了 ~20 个的 import/方法面。

---

## 5. 复算命令（原文）

```powershell
# 分母
(Get-ChildItem forge -Directory | ? Name -match '^\d').Count          # 16
(Get-ChildItem data -Directory | ? Name -like 'forge_*').Name          # 15 个 forge_<ver> + forge_javadoc
(Get-ChildItem fabric,forge,neoforge,quilt,liteloader,rift,modloader -Recurse -Filter *.java |
  ? FullName -match 'scaffold').Count                                  # 95
# quilt 跨档同文（G3）
node -e "const fs=require('fs');const a=fs.readFileSync('data/quilt_1.18.2/quilt-docs/1.18.2/processed/wiki-armor.md','utf8').split(/\r?\n/);const b=fs.readFileSync('data/quilt_1.21.11/quilt-docs/1.21.11/processed/wiki-armor.md','utf8').split(/\r?\n/);let d=0;for(let i=0;i<Math.max(a.length,b.length);i++)if(a[i]!==b[i])d++;console.log('diff lines='+d)"
# A10 证据的纳管状态（2026-09-25 起改指 tracked 版）
git ls-files mcp-server/docs/evidence-forge-1182-registries.md        # 1 行（已纳管）
git ls-files temp/ralph-20260922/evidence-forge-1182-registries.md    # 0 行（原件，.gitignore:44 temp/）
# 清尾①：现有门的复算（84 页拷贝事实 + 标注 + 双向）
node mcp-server/scripts/assert-quilt-unversioned-wiki.mjs             # ok（6 档 × 14 topic）
# 清尾③：qsl-verified 索引 sha 对账（含 l0/l1/l2 三件）
node mcp-server/scripts/assert-qsl-verified-sync.mjs                  # ok（判据④）
node mcp-server/scripts/repair-quilt-indexes.js --audit               # OK（双向齐、sha256 全对）
# 转码族分母（2026-09-25 现算：fabric-wiki 13×7=91 raw.txt + liteloader 34+35+34=103 raw.txt；"188" 不复现）
(Get-ChildItem data -Directory -Filter 'fabric_*' | % { (Get-ChildItem "$($_.FullName)\fabric-wiki" -Recurse -Filter *.txt -ErrorAction SilentlyContinue).Count } | Measure-Object -Sum).Sum
# 工具边界（2026-09-25 精确化）：给**具体文件** path 也恒 0；只对**目录** path 有效且不覆盖 data/**
#   search_content(pattern="DokuWiki", path="<具体.md 文件>") → 0；改 path="mcp-server/docs" → 命中
```

> ⚠️ 复核提醒：本文 §3.2 是对子代理交付的**否决**（G1 不成立）；§3.1 是对其**证实**（G3 成立，复核方式 = 逐行 diff）。
> 子代理其余结论凡未标「已复核」者，下一轮接手时按未验证处理。

---

## 6. 2026-09-25 清尾轮（①/②/③）与 A10/A11 切片进展

> 本节口径同上：标「已复核/已亲核」的才是我复跑过的；其余按子代理交付（未验证）登记。

### 6.1 三件清尾（全部落地）

| 项 | 结果（含复算入口） |
| --- | --- |
| ① 未版本化现行页门 | 新建 `mcp-server/scripts/assert-quilt-unversioned-wiki.mjs`；真跑 6 档×14 topic = **84 页全绿**；`--selftest` **7/7**（跨档改写 / 时间戳缺或重 / 警告删 / 未登记页 / 整页缺失 ⇒ 红；正对照绿）。已挂 `test-scripts.mjs` 两数组（真跑数组现 35 道 / 自证数组现 24 道） |
| ② A10 证据纳管 | tracked = `mcp-server/docs/evidence-forge-1182-registries.md`；2026-09-25 javap 重跑 **fields=32** 补全名单（29 `IForgeRegistry` + 3 `Supplier`）；四表已改、`assert-forge-1182-registry-consts.mjs` 已重签（FLUIDTYPES 6→10、verdict absent）状态一并记录 |
| ③ G4（qsl-verified 索引缺口） | 亲核：**6 档全部缺** sha256（18 条目中唯一；l0/l1/l2 三件同缺）——比子代理报的「只 1.21.11」更宽；`fetchedAt` 语义 = 派生件建立时间（不改）。修：`repair-quilt-indexes.js` 增补齐/纠偏 + `--audit` 判 rc（6 档各补 1 条：红→绿）；防复发：根 `scripts/index-qsl-verified.mjs` 补 sha 写/刷新；门：`assert-qsl-verified-sync.mjs` 判据④（先红 18 行→修后绿；自证 7 例） |

### 6.2 A10 切片（1.13.2–1.17.1 / 1.19.4；读 26 页，已亲核 5 行）

- 命中矩阵（**只限读过的页**）：1.14.4 / 1.15.2 / 1.16.5 / 1.17.1 的 registries 页只见 **BLOCKS + ITEMS**（`processed/concepts_registries.md:24`、`:81/:91`；1.14.4 两行已亲核逐字）；1.19.4 同 + `ForgeRegistries.Keys.BLOCKS`（`:50`，嵌套形态）+ datagen 页用原版 `Registries.*`；**1.13.2 相关页 0 命中 `ForgeRegistries.<NAME>`**（登记话题用类型名清单 + `GameRegistry.findRegistry`，`raw:29/:39` 已亲核）。
- `FLUIDTYPES` / `FLUID_TYPES` / `ForgeRegistries.FLUIDS` 在 26 页 **0 命中** ⇒ **无文档反例**；边界：这是「读过的 26 页的沉默」，**不是**整档不存在（每档另有 51–67 页未读）。
- forgedev / forgedev_prguidelines 6 档 `ForgeRegistries.` = 0（子代理读；我未逐页）。

### 6.3 A11 · neoforge knowledge 19 篇全读（3 条已亲核）

分母现算：10 档只有 `knowledge/common/verified-api-*.md`（10 篇）+ `porting/02-version-migration.md`（9 篇，1.20.1 缺）= **19 篇**；根 `knowledge/version-changes/1.20.x.md` 另 1 篇。

已亲核 3 条：
1. 【1.21.10】`porting/02-version-migration.md:11` 声称本档 `06-networking.mdc` 第 5 行与第 28 行矛盾、第 5 行按语料属误标 —— **规则文件已改齐**（`:5` 现文 = 宿主 1.21.5、不是 1.21.8，与语料计数一致）⇒ knowledge 那段裁定**已过期**。
2. 【1.21.5】`verified-api-1.21.5.md:16` 的 id `datamaps` 在本档不存在（实际 = `resources_server_datamaps.md` / `_builtin`）。
3. 【26.1】`data/neoforge_primers/26.3.md` 已在仓（manifest available:true）⇒ 「下一跳只谈 26.2」的叙述落后于语料。

未验证的可疑项（子代理交付，入口）：1.21.10 引规则行号越界（`08-client-server.mdc:10` ≠ 实文）、primer off-by-one（`1.21.6.md:2328`→`:2329`）、1.20.x 版本号两源不一致（scaffold `20.4.251` vs manifest `20.4.237`）、1.20.1 档实为 Forge 语料（`neoforge_1.20.1` 不存在 + id 前缀形式与全族不一致）、「计数类断言」（search_content 边界下无法复算）、1.21.1/1.21.3 相邻档 `setId` 必填相反等。

### 6.4 A11 · 转码族定位 + 13 页抽样

- **族定义**：`fabric-wiki`（13 档 × 7 = **91**，转换器 `process-fabric-wiki.js`）+ `liteloader-wiki`（3 档 × 33 = **99**，`_lib/thin-docs-wiki.mjs::dokuWikiToMarkdown`）⇒ **190 页**；raw 侧 91 + 103 = 194（含 verified-api 等非 wiki 页）。**「188 页」不复现**（已亲核分母：fabric 13×7 rawTxt=7/档、liteloader rawTxt 34/35/34）。
- raw **在仓内** ⇒ 逐行等价可做。抽样 13 页（已亲核：`tutorial_start.md:13` 断链残留 `https://discord.gg/RyPwrj5TDk|Fabric Discord Server`、`:65` `//italic//` 残留；liteloader `user_install_trail` 跨档仅 `> 版本：` 行不同=1/页）。
- 8 类差异（抽样层，子代理）：`[[url|label]]` 断链残留（真 bug）· `//italic//` 未转 · 标题后空行被吞 · `<code>` fence 多插空行（`<yarncode>` 干净）· `''x''` 跨档规则不一致 · 壳保留/双 H1 · 同族死链 · 表格分隔行零样本（相关函数 = 死代码）。
- 门化建议（**未实现**）：G-A 断链残留禁（零成本、会红 20+ 处）· G-B `//italic//` 台账 · G-C 同 slug 跨档一致 + 「不同转换器版本」登记 · G-D 壳行数契约 · G-E 站内死链。

### 6.5 工具边界修正（比 §5 原表述更强）

`search_content`：**给具体文件 path 也恒 0**（连本文搜 `DokuWiki` 都是 0）；给**目录** path 才生效，且**不覆盖 `data/**`**。仓内无 `.ignore`/`.rgignore`/`data/.gitignore`（机制推断在工具侧）。下一轮凡按此工具核 `data/**` 出「0 命中」的结论，一律按**未验证**处理。

### 6.6 A7 leg2「123 件」去噪复算（2026-09-25 亲跑；结论：判据需修 + 基线需重签）

- **复现**：临时脚本复刻 leg2 两分支（无 alt / alt 披露）⇒ 全平台 `judged=315 / old=123`，与门逐字一致（不是近似）。
- **假阳性 74 件**，两个判据缺陷：
  1. **等名对没进两侧集合**（11 件）：pairs 产物里 `mojmap Material ↔ yarn Material`（`net.minecraft.world.level.material.Material ↔ net/minecraft/block/Material`）这类**同简名行**被 leg2 的 `if (p.mojmap !== p.yarn)` 先跳过 ⇒ 简名失去「yarn 侧也存在」的保护，被无关行（`client.model.Material ↔ SpriteIdentifier`）毒进 `mojmapOnly`。样例：`fabric/{1.20.4,1.21.1,1.21.3,1.21.4,1.21.8,1.21.10,1.21.11}` 的 `mc-potion`/`mc-recipe`/`mc-gametest` 的 `[Items]`/`[Blocks]`/`[Potion]`。
  2. **嵌套类名不在 pairs 产物里**（63 件）：yarn 的 `Item$Settings` 等嵌套类只存在于 tiny（v1 格式：行首 `CLASS`、末列 named），pairs 产物只覆盖顶层类（sqlite `classes` 表 `named='Settings'` = 0 行）⇒ `[Settings]` 这类报点必假。门自己打印的头号样例 `fabric/1.16.5/.cursor/skills/mc-block.md [Settings, Material]` —— **两处都是假阳性**。
- **去噪后 49 件候选**（上界）= fabric 27 + forge 17 + neoforge 5：
  - fabric 27（声称 yarn 却用**非 yarn** 名）：`mc-item [DiggerItem]`、`mc-model [RotatedPillarBlock, StateDefinition]`、`mc-enchantment [LevelBasedValue, EnchantedItemInUse, …]`、`mc-enchantment|mc-gametest [Minecraft]`、`mc-ai [RandomStrollGoal, …]`、`mc-advancement [AdvancementType, InventoryChangeTrigger, …]`、`mc-cloth-config [Gui]`（**可能是第三方类名巧合，需逐件人判**）。
  - forge 17 / neoforge 5 是**反向**（声明 `official`/`mojmap` 却用了非 mojmap 名）：`forge/1.16.5` 一批 `[World, PlayerEntity, AbstractBlock, …]`（1.16 代 MCP 与 yarn 名高度重叠 ⇒ 「改声明为 mcp」还是「改名」需裁定）；`neoforge/*/mc-registry [Properties]` 很可能是 **mojmap 嵌套类** `BlockBehaviour$Properties` 的同类假阳性（本轮只剔了 yarn 侧嵌套；mojmap 侧缓存只有 7 档）⇒ **49 是上界，真值大概率更低**。
- **~~建议（未实施）~~ ⇒ 已实施（2026-09-25 当日）**：leg2 判据修法四件套 —— ① 等名对进两侧集合；② 两侧并入嵌套类最内段（主源 tiny named 列 / client.txt，缺源退产物 `$` 形态）；③ **段名只做保护、不做证据**（`Configuration`/`System`/`Method`/`EntryBuilder` 这类段名当证据会再产一批假阳性）；④ 第三方库撞名走**逐文件豁免台账**（`LEG2_FILE_ALLOW`，如 cloth-config 的 `@ConfigEntry.Gui.Excluded`）。**基线重签 123 → 53（①②）→ 31（③④）**（实测值；预估 43–49 偏保守 —— ③④ 又消掉 22 件段名假阳性）。自证 21/21（含 5 条新修正的可证伪例：段名不建旗 / 豁免在册 / 豁免不外溢 / 两类嵌套简名）。新增只读 `--dump-leg2` 打印全清单。
- **~~剩余 31 件（清理中）~~ ⇒ 清理批完成（2026-09-25 当日，子代理逐件分类 + 落地）**：**fabric 19 → 0**（10 件 = 围栏里的**元语境假阳性**——「不要 DiggerItem」禁止句 ×6、「Minecraft Wiki / EULA」专有名词 ×4，由修正⑤「元语境行不算用法」消；9 件 = 补披露行 / 新建披露块：mc-model ×3 +2/+2/+1 行、mc-enchantment ×2 +4/+11 行、mc-advancement ×2 各 +4 行、mc-ai 新建块 +6 行、mc-renderer 新建块 +1 行，行内容全部由 pairs 逐档 join 取证，`mappings_alt` 件 59→61）；forge/1.17.1 `Chunk` → `LevelChunk`（档内真名，语料 `blockentities_blockentity.md:49` 直证）。**基线 123 → 53 → 31 → 21 → 11**（判 315 件；镜像已 sync、`assert-skill-mirrors` 绿）。
- **剩 11 件 = forge/1.16.5「声明 `official` 却用 MCP 类名」——已裁决（2026-09-25 外网一手 + 修正⑥ 实施，基线归 0）**。裁决证据（逐字）：
  1. **Forge 官方 1.16.x 文档**（`docs.minecraftforge.net/en/1.16.x/gettingstarted/`，MIGRATION TO MOJANG'S OFFICIAL MAPPINGS 段）：「As of 1.16.5, Forge will be using Mojang's Official Mappings, or MojMaps… The official mappings provide **all method and field names, with the class names coming in 1.17**. Parameters and javadocs are not provided by this mapping set.」⇒ **1.16.5 的 official 通道只给方法/字段名，类名 1.17 才有**。
  2. **1.16.5 MDK 的 `build.gradle` 通道注释**（外网多处逐字）：「`official  MCVersion  Official field/method names from Mojang mapping files`」（下一行 `parchment … layered on top of official`）。
  3. 仓内互证：`data/forge_1.16.5/mappings/` 恰有 **MCP 类名源 `obf_to_srg.tsrg`**（`ceg net/minecraft/block/AbstractBlock` 等），而 1.17.1+ 各档只有 `client.txt`/`parchment` ⇒ 与「1.17 起 official 含类名」严格吻合。
  ⇒ **档内成文（`AGENTS.md:26`「official = 方法/字段官方名、类名仍是 MCP 名」）是对的，此前判「成文与 client.txt 冲突」是门侧误读**：`client.txt` 是 Mojang 原始文件，FG 在 1.16.5 **不从它取类名**。
- **修正⑥（MCP 类名保护）实施**：leg2 的 `yarnOnly`（official/mojmap 方向）扣除 `data/forge_<v>/mappings/*.tsrg|*.srg` 的类行简名（含嵌套内段）⇒ 11 件全绿，**基线 123 → 53 → 31 → 21 → 11 → 0（零容忍）**；自证 27/27（新增三例：MCP 类名不得判 / 嵌套简名不得判 / 真 Yarn 名对照必须红）。

### 6.7 错修与遗留修复批（2026-09-25；「同型问题在之前被错误修复了吗」的核查结果）

先给结论：**同型「错修」全仓只找到 1 处**（其余是初代导入的遗留，不是修复引入）；已全部修掉并配门。

**A. 真·错修（1 处，已回改）**
- **1.16.5 `mc-particle`**：`sweep69`（commit `71027844`）把 MCP 类名 `ServerWorld` 改成了 Mojang 类名 `ServerLevel`（3 行：`// ServerLevel …` 注释、`serverLevel.sendParticles(` 变量、`❌ … ServerLevel#sendParticles` 反例行）。判错依据：① 本档钉 `official` 而 1.16.5 的 official **不含类名**（Forge 官方 1.16.x 文档逐字，见 §6.6）；② 本档语料现跑 `ServerWorld` = 4 命中 / `ServerLevel` = 0 命中。已回改 `ServerLevel` → `ServerWorld`（`World#addParticle` 反例行同步）。
- 同 commit 其余改动**方向正确**（`BlockEntity`→`TileEntity`、`BlockGetter`→`IBlockReader` 等 MCP 层名），且 `71027844` 在 1.16.5 skills 里的 Mojang 名 `+` 行只此 3 行 ⇒ 该 commit 的错修面就是这一处。

**B. 初代导入的遗留（同型，非修复引入；已修）**
- **`mc-weather:17` 的 `query_api（Level / ServerLevel 天气相关方法）`**：5 个 MCP 时代档（1.12.2 / 1.13.2 / 1.14.4 / 1.15.2 / 1.16.5，出处 = 初代 `5e197dde`）全带这句 ⇒ 改为 `World / ServerWorld`；**1.17.1+ 各档保留 `Level / ServerLevel`（本来就对）**。
  ⚠️ **本条于 §6.8（同日第二遍）被修正**：`World / ServerWorld` 只对 1.14.4 / 1.15.2 / 1.16.5 成立；**1.12.2 / 1.13.2 的 MCP 类名是 `WorldServer`**（`data/forge_1.12.2/mappings/joined.srg`：`WorldServer`=116 / `ServerWorld`=0；`data/forge_1.13.2/mappings/joined.tsrg`：`td net/minecraft/world/WorldServer`）——那两档已再修为 `World / WorldServer`。
- **1.16.5 `rules/01-registry.mdc`**：`.requiresTool()`（`:174`/`:225`）+ `.maxStackSize(64)`（`:186`）是 MCP 形态方法（出处 = 初代 `586c86f2`），与本档 official 通道及同档 `03-item.mdc`（已全用 `.stacksTo()/.tab()`）矛盾 ⇒ 已改为 `.requiresCorrectToolForDrops()`（official 侧 `client.txt:63805` 有方法形直证）与 `.stacksTo(64)`（`client.txt:53857` 直证）。
- **`mappings: hint`**（`forge/1.20.1/.cursor/skills/mc-compat-jei/SKILL.md`，出处 `sweep16`）：垃圾值（该件是 `platforms: [fabric, forge, neoforge]` 的跨平台社区件，围栏是 Decision 伪码、不含 MC 类名）⇒ 改为本档钉值 `parchment`（跨平台件不进 leg2 的单族判据；若日后写入具体平台代码，再按平台重裁）。
- **94 件 `mappings: mcp` → `mappings: parchment`**（1.18.2×21 / 1.19.4×20 / 1.20.1×33 / 1.20.4×20；出处 = 初代默认值）：证据 = FG5 官方文档逐字「stable/snapshot（MCP 生成）**自 1.17 起不再存在**」+ 本包四档 scaffold 全部钉 `parchment`（`1.20.1/gradle.properties` 注释：「parchment = mojmap 名 + 社区参数名/javadoc」）+ 同档其余件早已是 parchment（改后四档均 = 0 mcp / 35 parchment）。字节保真批改（只替换该行，保留原行尾/BOM）。

- **另两处注释误读（同族）**：`forge/1.20.4/scaffold/gradle.properties:13-15` 与 `neoforge/scaffold/gradle.properties:14-16` 原写「默认 official = MCP」+「official: Mojang **混淆**名」——两重错（official ≠ MCP，且 official 是 Mojang **官方可读名**、不是混淆名）⇒ 已按各档实际通道改准（1.20.4 默认 parchment / neoforge 默认 official）。

**C. 门防复发（leg1 增两记，自证 31/31）**
- **值域**：`mappings:` 值前缀必须在册（`yarn / mcp / parchment / official / mojmap / mojmap-unobfuscated`；「值+括注」体例取前缀）——`hint` 这类垃圾值当场红。
- **值-版本**：`mcp` 只在 ≤1.16.5 的 forge 档成立（FG5 文档依据同上；带 `platforms:` 数组的跨平台件不按档位判）。

**D. 核查过「没被改错」的（供后续对照）**：`sweep69` 的 MCP 层改名批次 ✓；`sweep101` 的 `BlockEntity@1.16.5 found=false` 备注 ✓；`a084cbdc` 的 `parchment→official` 声明变更 ✓；1.17+ 档的 MCP 名只出现在反例/对照语境 ✓；`knowledge/antipatterns/item.md:130` 的 `CreativeModeTab` 在「❌ 错误（1.20.1 方式）」反例块内 ✓；1.13.2 rules 的 `BlockBehaviour.Properties` 在「不是 1.14+ 的…」反例句内 ✓。

### 6.8 全平台/全版本跨层名审计（2026-09-25 第二遍；「其他平台其他版本有没有 1.16.5 式混合 / 被错改」）

**判据（本轮确立）**：每档的**类名层**由版本决定 —— forge ≤1.16.5 = **MCP 类名**（该档 `official` 通道**不含类名**，类名沿用 MCP；Forge 1.16.x 官方文档逐字见 §6.6，本仓 `obf_to_srg.tsrg` 即该层）；forge 1.17.1+ = **mojmap**（`official` 与 `parchment` 都叠在它之上，parchment 只补参数名/javadoc）；fabric 1.14.4–1.21.11 = **yarn**、26.1.2 = **去混淆官方名**；quilt = yarn；liteloader / rift / modloader = MCP 系老档；bedrock = 无 Java 映射。**「同档两套名混用」是否合法，取决于该档声明的层是否只提供部分名字**：1.16.5 `official` 只给方法/字段名 ⇒ 文件里 MCP 类名 + Mojang 方法名是**合法混合**（§6.6 裁定）；而 1.14.4 声明 `parchment` 则**不合法**（该档无此通道）。

**逐档三名列盘存（源稿 `.cursor` 侧；词边界 + 大小写敏感）**：

| 档 | 改前盘存 | 该档正名 | 处理 |
| --- | --- | --- | --- |
| 1.12.2 | `WorldServer`=2 / `ServerWorld`=1（mc-weather 散文行） | `WorldServer` | 已修 1 处 |
| 1.13.2 | `WorldServer`=2 / `ServerWorld`=1（同） | `WorldServer` | 已修 1 处 |
| 1.14.4 | `ServerWorld`=4 / `WorldServer`=3（meta 注）/ 裸 `Level`=8（多 `level` 变量） | `World` / `ServerWorld` | 已修 3 处（entity.md×2 + mc-sound 标题） |
| 1.15.2 | `ServerWorld`=2 / 裸 `Level`=7（全 `level` 变量） | 同上 | 无需改 |
| 1.16.5 | `ServerWorld`=4 / 裸 `Level`=14（1 处真泄漏 + `level` 变量 + api-index 说明） | 同上 | 已修 1 处 |
| 1.17.1 | `ServerWorld`=1+9(rules) / `ServerLevel`=4 | `Level` / `ServerLevel` | 已修 6 处 |
| 1.18.2 / 1.19.4 / 1.20.1 / 1.20.4 | 同上（`ServerWorld` 各 1+1、`ServerLevel` 各 7–8） | 同上 | 各修 2 处（1.20.1 无 rules 处） |

**本轮修 15 处（14 件）**，逐条判据：

| # | 位置 | 旧 → 新 | 判据（本地一手源） |
| --- | --- | --- | --- |
| 1 | `forge/1.13.2/.cursor/skills/mc-weather/SKILL.md:17` | `ServerWorld` → `WorldServer` | `data/forge_1.13.2/mappings/joined.tsrg` = `td net/minecraft/world/WorldServer`；`ServerWorld` 0 命中 |
| 2 | `forge/1.12.2/.cursor/skills/mc-weather/SKILL.md:17` | 同 | `data/forge_1.12.2/mappings/joined.srg`：`WorldServer`=116 / `ServerWorld`=0 |
| 3–7 | `forge/{1.17.1,1.18.2,1.19.4,1.20.1,1.20.4}/knowledge/antipatterns/networking.md:71` | `ServerWorld` → `ServerLevel`（含注释文案） | 各档 `client.txt` 有 `ServerLevel`（1.17.1 563 命中）、无 `ServerWorld`；**同句 `getLevel()` 已是 mojmap** ⇒ 该行本应 mojmap |
| 8–11 | `forge/{1.17.1,1.18.2,1.19.4,1.20.4}/.cursor/rules/06-networking.mdc:13` | 同 | 同上（禁止句点名的类在本档不存在） |
| 12 | `forge/1.16.5/code-patterns/01-block-patterns.md:88` | `Level` → `World` | 1.16.5 = MCP 类名层（tsrg `net/minecraft/world/World`）；同文件 `:51` 已是 `World`、`:67-80` 全 MCP |
| 13 | `forge/1.14.4/knowledge/antipatterns/entity.md:80,86` | `Level` → `World` | 该档 MCP；同行 `level.isRemote` 亦 MCP（mojmap 是 `isClientSide`） |
| 14 | `forge/1.14.4/.cursor/skills/mc-sound/SKILL.md:7 / :80` | `mappings: parchment` → `mcp`；`Level.playSound` → `World.playSound` | 1.14.4 无 parchment 通道（`data/forge_1.14.4/mappings` 只有 MCP csv+zip；`forge-versions-manifest.json` = `"mappings": "mcp"`）；正文 `world.playSound`/`EntityPlayer`/`SoundCategory` 全 MCP |

镜像：`forge/{1.12.2,1.13.2,1.14.4,1.17.1,1.18.2,1.19.4,1.20.4}` 七档已 `sync-skills.ps1`（skills + rules + AGENTS 投影）；`knowledge/**` 与 `code-patterns/**` **不被该脚本投影**（`scripts/sync-skills.ps1:4-6` 只声明 rules/skills/AGENTS/CLAUDE）⇒ 那两类只改源稿。验证 = 词边界 + 大小写敏感全仓复查，8 项全 0；门链 `assert-skill-mappings-key`（1247 件 / leg2 判 315 / 冲突 0 / 自证 31）、`assert-skill-mirrors`、`assert-rule-ledger` 全 rc=0。

**门覆盖缺口（本轮实测，建议下一轮）**：
1. `leg2` 只判 `.cursor/skills/**` 的**围栏代码**，且 `declared ∈ {yarn, mojmap, official}`（`assert-skill-mappings-key.mjs:350`）⇒ **`parchment`（forge 四档 35×4=140 件）与 `mcp`（≤1.16.5 各档）根本不进判据面**；建议把值域按族扩到 `parchment`（mojmap 族）与 `mcp`（已有 `mcpClassNameProtect`）。
2. **`knowledge/**`、`code-patterns/**`、`.cursor/rules/**`、`AGENTS.md`、`scaffold/**` 无任何门** —— 本轮 15 处里 **13 处**落在此盲区（`leg2` 的样本永远只来自 skills）。
3. **散文行不判**（`mc-weather:17` 就是散文行）——恰好是最容易漂的一类（它是「工具面口径」句）。
4. 扫描器（本轮一次性脚本 `temp/_cross-layer-scan.cjs`）**只作筛查**：token 级匹配会把 Forge 嵌套类（`NetworkEvent.Context`）与 MC 同类名混同 ⇒ 任何结论都必须回落到该档映射源逐条确认（本轮即如此）。

**未决（待裁定，未动文字）**：
- **`forge/1.15.2` 口径矛盾**：`scaffold/gradle.properties:14` `mapping_channel=official` + `AGENTS.md:29`「本档只有 official 可用可读名」，而同档 **35 件 skills 全 `mappings: mcp`**、`.cursor/rules/00-project-setup.mdc:66-69` 说「默认 MCP」、`data/forge-versions-manifest.json` 记 `"mappings": "mcp"`。⚠️ 但 `AGENTS.md:28` 记录该 scaffold（FG `[4.1,4.2)` + Gradle 6.9.4）**真机 `BUILD SUCCESSFUL`** ⇒ `official` 通道在 1.15.2 可能真的可用（Mojang 自 1.14.4 起发布官方映射）——两侧都有本仓证据，**未裁定前不动**（要么改 scaffold 回 MCP 通道，要么把 35 件 skills 的声明与 rules 口径改成 official 族）。
- **`forge/1.16.5` 同档 12 `official` + 23 `mcp` 分档**：两通道在 1.16.5 都合法、类名都是 MCP，差别只在**方法/字段名**（`getEntityWorld` vs `getLevel`）。本仓**缺 1.16.5 的 MCP named 方法表**（`data/forge_1.16.5/mappings/` 只有 `client.txt` + `obf_to_srg.tsrg` + parchment）⇒「那 23 件的正文方法名是否与 `mcp` 声明一致」无法机判，登记待核。

**复核命令**：
```powershell
# 三名列盘存（源稿侧；词边界 + 大小写敏感是关键，PowerShell Select-String 默认不区分大小写）
foreach($v in @('1.12.2','1.13.2','1.14.4','1.15.2','1.16.5','1.17.1','1.18.2','1.19.4','1.20.1','1.20.4')){
  $src = Get-ChildItem "forge/$v" -Recurse -Include *.md,*.mdc | Where-Object { $_.FullName -match '\\\.cursor\\' }
  foreach($t in @('ServerWorld','ServerLevel','WorldServer')){
    $v + ' ' + $t + '=' + ($src | Select-String -CaseSensitive -Pattern ('(?<![A-Za-z])'+$t+'(?![A-Za-z])') | Measure-Object).Count } }
# 档位类名层的一手源
git --no-pager diff --stat -- forge/1.13.2 forge/1.12.2   # 只应含 mc-weather 源稿 + 7 套镜像
node -e "const fs=require('fs');const t=fs.readFileSync('data/forge_1.13.2/mappings/joined.tsrg','utf8').split(/\r?\n/);console.log(t.filter(l=>/World(Server)?\b/.test(l)).slice(0,3).join('\n'))"
```

### 6.9 缺口①②落地 + 两个未决项的外网取证（2026-09-25 当日；用户裁定「完成①②，③先搜索不动」）

**① leg2 值域扩到 `parchment` / `mcp` 族**（`assert-skill-mappings-key.mjs`）
- 判据：`yarn` 一侧 ↔ 其余（mojmap / official / **parchment** / **mcp**）一侧。依据：official 与 parchment 都叠在 mojmap 上（parchment 只补参数名/javadoc）；mcp（≤1.16.5）的**类名**由 `mcpClassNameProtect` 兜底。判件 **315 → 437**。
- 首测 8 件冲突全部按**内容**修正（无一进基线）：6 处 = 围栏内注释里的普通英文/中文用词（`TestFunctions`/`Chunk`×3/`Criteria`×4 ⇒ 改 `TestFunction`/`LevelChunk`/`criterion`，语义不变）；2 处 = 上游页面转述的旧套名（1.20.1 / 1.20.4 `mc-potion` 的 `BrewingRecipeRegistry` ⇒ 本档 mojmap 真名 `PotionBrewing`，页面原文的引用保留在**散文行**，不进围栏）。
- 另加 leg1 一条**值-版本**判据：`parchment` 自 **1.16.5** 起才有（本仓 `data/` 的 parchment 产物最早 1.16.5；§6.8 的 `forge/1.14.4 mc-sound` 即违规样本）⇒ 自证 **31 → 37 例**。
- 结构改动：该门加 `isMain` 守卫并 `export { loadPairs, LEG2_META_LINE, PAIRS_DIR }` —— 供新门复用，**避免两份名字集合实现漂移**。

**② 新门 `assert-cross-layer-names.mjs`**（覆盖 leg2 判据面之外：`knowledge/**`、`code-patterns/**`、`.cursor/rules/**`、`AGENTS.md`、`CLAUDE.md`、`scaffold/**`）
- 判据 = 「档位类名层」× 四条腿：**A** yarn 档用 mojmap 名；**B** mojmap 档用 yarn 名；**C** mojmap 档用**本档 mojmap 里不存在**的 MCP **顶层**名；**D** MCP 档用同代 mojmap 名。
- 首测（判 847 件含代码 / 扫 1249 件）：**A=82 B=48 C=33 D=109**；基线登记 **A/B=130 / C=33 / D=109**（棘轮只许降；`--strict` 忽略基线看全量）。构成：fabric `knowledge/porting/forge-to-fabric.md`（移植指南**合法**点名 Forge 侧类名）与 `scaffold/**` 是 A/B 噪声主源；C 多为 1.16 代 MCP 名（`SetCount`/`LootEntry`/`EntityDataManager`/`KeyBinding`）残留在 1.17+ datagen/事件页（另有 Forge 自有类 `ItemModelProvider` 撞名待核）；D 的 `version-changes/**`/`porting/**` 跨版本对照 + 通用英文词（`Resource`/`Pack`/`Recipe`/`Player`/`Context`）是主源 ⇒ 三者都需逐条人核后再降。
- 实现纪律（三条都是本轮踩过的坑，已写进脚本注释）：只认**顶层名**（段名不当证据，与 leg2 修正③同源）；无该档对照产物**不拿跨档并集凑**（如实计入 `noPairs`——首测拿并集凑出 97 件假阳性）；`loadPairs` 返回的是 **Map**，新门必须先摊平成对象（否则 `pairs?.[ver]` 恒 undefined、**腿 A/B 静默失效**——首测真踩到）。
- 自证 **15 例**（四腿判据 / 层推导 / 代码位抽取 / 端到端先红后绿）；挂 `test-scripts.mjs` 两条数组（真跑 **36** / 自证 **25**，地板注释同步）。

**③ 两个未决项的外网取证（只搜不动，用户裁定）**
- **1.16.5 的 12 `official` + 23 `mcp` 分档** —— 一手：Forge 官方 1.16.x 文档逐字「**As of 1.16.5**, Forge will be using Mojang's Official Mappings, or MojMaps… **The official mappings provide all method and field names, with the class names coming in 1.17. Parameters and javadocs are not provided by this mapping set.**」（同页给出 MCP 回退 `mappings channel: 'snapshot', version: '20210309-1.16.5'`）；Forge-Class-Remapper README：「**Forge 1.16 and lower uses MCP classnames**」；FG 配置模板注释：「默认通道集 `["official","snapshot","snapshot_nodoc","stable","stable_nodoc"]`，`official | MCVersion | Official field/method names from Mojang mapping files`」。⇒ 1.16.5 的 `official` 与 `mcp` **两通道都合法、类名都是 MCP**，差别只在方法/字段名 ⇒ 12+23 的分档**本身不是错**；**待核的是那 23 件正文方法名是否真是 MCP 名**（本仓缺 1.16.5 的 MCP named 方法表 ⇒ 仍无法机判）。
- **1.15.2 scaffold `official`** —— 网侧只到「FG 默认通道集含 `official`，其行为 *Official field/method names from Mojang mapping files*」，**没有**任何一手材料说 `official` 在 1.15.2 可用/不可用（MCPConfig 仓库 `versions/` 只抓到 `pre|release|snapshot` 三级目录，页面渲染失败，未展开到版本号）。本仓侧证据仍是两边：官方 1.15.2-31.2.57 MDK 用 `snapshot 20200514-1.15.1`（`AGENTS.md:29` 引 MDK `build.gradle:29`）、`forge-versions-manifest.json` 记 `"mappings": "mcp"`；而同档 AGENTS 又记 FG `[4.1,4.2)` + Gradle 6.9.4 **真机 BUILD SUCCESSFUL**（official 可能真解析得动）。⇒ **已定案（2026-09-25 当日，见 §6.10）**：官方 MDK 侧与 skills 侧的矛盾**不是 scaffold 错** —— 本机一手 javap 直证 `official@1.15.2` **可用且成员名可读**；未决的是 skills 侧那 35 件 `mappings: mcp` 的旧默认值与正文混用。**文字不动**，待一轮批量口径统一。

### 6.10 ③ 两项定案（2026-09-25；用户授意「上网找 1.16.5 的 MCP named 表 + 看本机 `D:\mc-skill-temp`」）

**取证物（全一手）**
1. **1.16.5 的 MCP named 表**：`https://maven.minecraftforge.net/de/oceanlabs/mcp/mcp_snapshot/20210309-1.16.5/mcp_snapshot-20210309-1.16.5.zip`（HEAD **200** / 478,481 B；sha1 `f6273df8817a92d41cf417a1a5935c08e09035ec`）⇒ 解出 `fields.csv`(544KB) / `methods.csv`(586KB) / `params.csv`(604KB)，**已纳管**至 `data/forge_1.16.5/mappings/mcp_snapshot-20210309/`（另附 `provenance.json`：源 URL / sha1 / bytes / fetchedAt / 用途）；`git check-ignore` = **未被忽略**（待提交）。旁证：本机 `D:\mc-skill-temp\mcp_20200514-1.15.1.zip`、`mcp_20201028-1.16.3.zip` 是同族三件套。
2. **1.15.2 的判定物**：本机 Gradle 缓存里**已有两个 mapped jar** —— `~\.gradle\caches\forge_gradle\minecraft_user_repo\net\minecraftforge\forge\1.15.2-31.2.50_mapped_official_1.15.2\…jar` 与 `…\1.15.2-31.2.50_mapped_snapshot_20200514-1.15.1\…jar`（同代还有 `-srg.jar` / `-mci.jar` / `-injected.jar` / `-binpatched.jar`）；配套 FG4 实验树 `D:\mc-skill-temp\w54b_fg4exp*_1.15.2`（**全部** `mapping_channel=official`）与日志（exp6/exp8 `BUILD SUCCESSFUL` in 20s/16s，含 `extractSrg`/`createMcpToSrg`；exp5 编译失败于 `ItemGroup.BUILDING_BLOCKS` / `Food.Builder`）。

**① 1.15.2：`official` 可用且可读 —— scaffold / AGENTS 是对的，未决在 skills 侧**
- javap（JDK17，`G:\JAVA17\…\javap.exe`）`official@1.15.2`：类名 = **MCP 形**（`net/minecraft/world/World`、`net/minecraft/block/Block$Properties`、`net/minecraft/item/ItemGroup`、`net/minecraft/util/text/ITextComponent`）；成员名 = **Mojang 侧**：`Block$Properties.of(...)`（**无** `create`）、`World.isClientSide`（字段 + `isClientSide()` 方法，**无** `isRemote`）、`getLevel()`。
- 对照 javap `snapshot@1.15.2`：类名同（MCP 形），成员名 = **SRG**（`field_195596_d`；`isClientSide/isRemote/getLevel` 全 0 命中）⇒ 该通道**不可读**。
- ⇒ 与 `forge/1.15.2/.cursor/rules/05-events.mdc:64`、`06-networking.mdc:15` 里**早已记着**的「2026-09-14 javap 实测：official 1.15.2 `World`…」一致；`AGENTS.md:29`「本档只有 official 可用可读名」**成立**；scaffold `mapping_channel=official` **有效**（FG4+Gradle 6.9.4 真机 BUILD SUCCESSFUL 亦合）。
- **真正未决的是 skills 侧**：35 件全声明 `mappings: mcp`，而正文成员名**两边混用** —— `isClientSide`（Mojang 侧）**20 处** vs `isRemote`（MCP 侧）1 处；`Properties.create(`（MCP 侧）**24 处**（`.create(` 共 91 = 24 `Properties.create` + 47 `DeferredRegister.create` + 其余）。⇒ 与 1.16.5 **同型**（声明用旧默认值、正文混两套）。**文字不动**，待用户裁定后的批量口径统一。

**② 1.16.5 的 23 件 `mcp` 声明：正文里 0 处 MCP 侧证据**
- 判法（一次性脚本 `temp/_method-name-verdict2.cjs`）：MCP named 名 = 刚纳管的 `methods.csv ∪ fields.csv`；Mojang 名 = `client.txt`（**缩进行**：`l1:l2:<sig> -> <obf>` 取方法名、`<type> <name> -> <obf>` 取字段名）；只取**调用位 / 成员位的 camelCase、≥5 字符** token（剔 `world`/`event`/`name` 这类通用词噪声），按「MCP 专有（∈MCP∖Mojang）」↔「Mojang 专有（∈Mojang∖MCP）」投票。
- 结果（`forge/1.16.5` 35 件）：**23 件 `mcp` 里 Mojang 侧为主 3 件**（`mc-datagen`：`buildShapelessRecipes`/`getGenerator`/`unlockedBy`；`mc-networking`：`sendToServer`/`readInt`；`mc-renderer`：`renderByItem`/`isUsingItem`/`getUseItem`）、**MCP 侧为主 0 件**、余 20 件**无判定证据**（正文没用到两套互斥成员名）；对照 12 件 `official`：Mojang 侧为主 6 件 / MCP 侧 0 件。
- ⇒ 判读：那 23 件的 `mcp` 声明**既不被正文支持、也没有任何 MCP 侧样本**；按本门「键值 ↔ 正文实名一致」口径，它们应与骨架及另 12 件统一为 `official`（属批量口径改，**仍不动**，登记待裁）。

**④ 腿 E（成员名族）落地 + 文件内提醒（同日；用户裁定「A + 在文件中提醒混合档」，并否决「统一到 official」——理由成立：1.16.5/1.15.2 的 `mcp` 是**合法值**，与 1.18.2+ 那 94 件的「非法值」不同类）**
- 新腿 E（`assert-cross-layer-names.mjs`）：对**混合档（forge ≤1.16.5）的声明件**判「`mappings` 值与正文**成员名族**是否相反」——声明 `mcp` 却只见 Mojang 侧成员名 / 声明 `official` 却只见 MCP 侧 ⇒ 红；**两套并用（真混合）与无判别名不判**（实测 1.16.5 有证据的 36 件里多数并用）。MCP 侧 = 刚纳管的 `mcp_snapshot-20210309`；Mojang 侧 = `client.txt`（gitignored ⇒ 缺档计 `noMemberTables`，不静默绿——1.15.2 档即此状态 140 件）。
- 首测 **E=2** ＝ 基线 2（`forge/1.16.5` `mc-networking`：`sendToServer`/`readInt`；`mc-renderer`：`renderByItem`/`isUsingItem`/`getUseItem`）；自证 +6 例（反向两态 / 两套并用 / 无判别名 / 缺表）。
- 接线坑（已修并写进注释）：腿 E 的声明件只在 `.cursor/skills/**`，而跨层门主循环按 leg2 口径**排除**它们 ⇒ 首接 E=0（静默失效）；改为 `collectDeclared()` 独立取件后 E=2。
- **文件内提醒（用户要求）**：`forge/1.16.5/AGENTS.md` 与 `forge/1.15.2/AGENTS.md` 的 Mappings 行各补「**本档是混合档**」段（两通道类名同一套、差别只在成员名；逐件值只描述成员名族且并非每件经核实；对照表路径）；被腿 E 点名的 `forge/1.16.5/.cursor/skills/mc-networking/SKILL.md` 正文头补同款提醒（`mc-renderer` 此前已有同款）。两档镜像已 sync。

**⑤ 审阅修正（同日；外部审阅指名，三条全成立）**
- **「缺成员名表」分桶**：原 `noMemberTables` 把两种原因混在一起——① `client.txt` 不可再分发（**许可**，合法跳过）② 已纳管的 MCP named csv 缺失/未 add（**数据洞**）。clone 上两者都让腿 E 静默失效且会被读成许可原因。现拆 `noMemberTablesLicense` / `noMemberTablesData`，**数据洞计 rc**；摘要行分桶打印（本机实测：许可 140 · 数据洞 0）。
- **纳管表完整性审计**（`provenanceAudit`）：`*provenance*.json` 视为「这批表应存在且应入库」的标记——① 标记在而 `contains` 列的 csv 缺 ⇒ 数据洞（红，与 client.txt 有无无关）；② csv 在盘却未被 git 跟踪 ⇒ **每次可见的 WARN**（不计 rc：整树未提交是本仓常态，由 L10 收口）。本机实测 WARN 正确点名 4 件。
- **扁平化**：`data/forge_1.16.5/mappings/mcp_snapshot-20210309/{3 csv}` → `mappings/` 顶层（与 1.14.4/1.15.2 同形），provenance 改名 `mcp_snapshot-20210309.provenance.json` 同目录。**消费者审计结论**：平铺 join 消费方（`mcp-csv-extractor.js:223`、`build-yarn-sqlite.mjs:429/:485`）此前看不到子目录形；扁平化后 ① `mcp-csv-extractor.js --version=1.16.5` 由不可用变可用（手动 CLI，不在门链）；② `build-yarn-sqlite --all` 的源候选链（tiny→joined.tsrg→joined.srg→**methods.csv**→json）使 1.16.5 **有资格**建 `mcp-csv` era 的 sqlite（同 1.15.2；现状无 sqlite ⇒ 下次 `--all --write` 会新建，属预期收益，本轮未执行）；③ `import-mcp-csv.mjs` 是纯库（路径参数）不受影响；④ 本门 `mcpMembersOf` 平铺+子目录双读 ✓。`audit-data-consistency` / 全链复跑 rc=0。
- **L10（`CONTRIBUTING.md:393`）已补第二遍现扫**：**14 路径 / 17 文件**（第 40 轮 10 件之外：2 道新门 + 1 份 evidence doc + 4 件数据），并标注「不 add 则 clean clone 上腿 E 静默失效」。

**⑥ N0/N1/N2/N3 对盘（2026-09-25 同日；外部推荐单四条，逐条对盘后只做真开放的）**
- **N1（A4c 两处口径 + 17 host）＝已在盘，不做**：`src/upstream/releases.ts:288 mavenNotFoundHint` / `:297 notFoundPayload` / `:317` 接线 / `:506-508`；台账 `mcmap-linkie-absorption.md:86/:99`「白名单在册、正值未证 ⇒ available:false 只证伪该坐标」、§3② 17 host。重做会覆盖。
- **N2（A1/L1 拒绝码 + 46 处 code:null）＝已在盘，不做**：`write-helper.ts:200` 唯一出口（`result.action ?? generatorRejectionAction(...)`）+ `actionable.ts` 18 键 + `common.ts` 单点分类器；**46 处 `code:null` 是骨架代码位、不是错误码**（`common.ts` 注释在案，属已裁定保留）。
- **N0＝拆两半**：① `get_server_status` 回显 `clientCapabilities` 探针 **不做**——它改该工具的输出形状并需 build/宿主重载，而 A4a 的裁定是「只探测不改形状」（探针结论已在本文 §4 A4a）；建议单独立项。② outputSchema 纪律判据 **已做**：`test-scripts.mjs` #18 新增「A4b 棘轮：outputSchema 保持 1/82」（对 `src/tool-registry.ts` 做 `^\s*outputSchema:` 计数 = 1，铺开须先撤判据）。
- **N3＝放行腿 + 覆盖披露已做；清单扩面不做（测量否决）**：`assert-skill-yarn-attest.mjs` ① 显式**放行 `fabric/26.1.2`**（该档 deobfuscated、按设计无 yarn 库 ⇒ attest 判据不适用；过去靠「不在清单里」静默缺席，现显式计数）；② 汇总**覆盖披露**（清单 33 ＝ 判 33 + 放行 0；fabric 技能源稿共 **532** 件 ⇒ 未入清单 499）。③ **清单全量扩面实测 = rc1、约 1615 处问题行**（canonical 532 件，排除镜像）⇒ 属批量工程（A11 级），**未做**，数字已写进门摘要供下次裁定。
