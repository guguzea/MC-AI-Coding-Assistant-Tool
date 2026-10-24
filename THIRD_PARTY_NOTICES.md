# Third-Party Notices

This repository’s **own code** (MCP server, scripts, agent rules, scaffolds, etc.) is licensed under the MIT License — see [`LICENSE`](./LICENSE).

The offline bundle under `data/` (and the GitHub Release `mc-skill-data-full-*.zip`) may include third-party documentation extracts, mapping artefacts, and related materials. Those retain their **upstream licenses and terms**. This notice must be kept when redistributing the full data asset, alongside the MIT `LICENSE` for this project’s code.

## Runtime / build dependencies (MCP server)

Declared in `mcp-server/package.json` (install via `npm ci`; not vendored in git / Release):

| Package | Role | Upstream |
|---------|------|----------|
| `@modelcontextprotocol/sdk` | MCP stdio protocol SDK | https://github.com/modelcontextprotocol |
| `zod` | Schema validation | https://github.com/colinhacks/zod |
| `@xenova/transformers` | 本地语义嵌入（feature-extraction） | https://github.com/xenova/transformers.js |
| `onnxruntime-node` | Transformers.js ONNX 后端 | https://onnxruntime.ai |
| `java-parser` | Java 源码 CST 抽取（loader-api） | https://github.com/jhipster/prettier-java |
| `typescript` / `@types/node` / `tsx` (dev) | Build & types | respective upstreams |

Follow each package’s license as published on npm（`@xenova/transformers` 为 Apache-2.0；`onnxruntime-node` 为 MIT；`java-parser` 为 Apache-2.0）。

**嵌入模型缓存**（不进 npm；由 `npm run fetch:embedding-model` 写入）：

- Model: `Xenova/all-MiniLM-L6-v2`（Apache-2.0）
- Path: `data/_models/Xenova/all-MiniLM-L6-v2/`
- Runtime: `allowRemoteModels=false`（禁止静默联网）；缺模型时检索降级 FTS5 / L0

## Minecraft Forge documentation / Javadoc extracts

- Source: Minecraft Forge project documentation and related materials
- Upstream: https://docs.minecraftforge.net / https://github.com/MinecraftForge
- Typical local paths: `data/forge_*/forge-docs/`
- License: follow upstream Forge / documentation terms

### Legacy Forge Javadoc（`data/forge_javadoc/<mcVersion>/`，1.7.10–1.12.2）— **第三方镜像，非官方**

- Actual host: **https://skmedix.github.io/ForgeJavaDocs/** （社区维护的 Javadoc 存档镜像，非 MinecraftForge 官方发布物）
- Per-page provenance: 每页 frontmatter 带 `source:`（含完整构建号，如 `…/forge/1.12.2-14.23.5.2859/…`）、`forgeBuild:` 与生产者标记 `fetchedWith:`
- Fetcher: `mcp-server/scripts/fetch-forge-javadoc.js`（构建号钉在该文件的 `JAVADOC_VERSIONS` 表）
- 含义：类名与方法签名以 Mojang/Forge 游戏内容为事实来源，但**页面排版与 javadoc 注释出自该镜像**；需要官方一手 Javadoc 时请回到 `docs.minecraftforge.net`，本仓库只提供离线检索。
- License: follow upstream Forge terms for the API content; mirror page chrome follows the mirror's own publication

## Paper（服务端插件）documentation extracts（`data/paper_stable/paper-docs/stable/`）— **正文为 CC BY-SA 4.0**

- Source: **PaperMC 官方开发文档**（`https://docs.papermc.io/`），文档仓 = `https://github.com/papermc/docs`（Starlight/Astro）
- Fetcher: `mcp-server/scripts/fetch-paper-docs.mjs`（**默认 dry-run**，`--extract` 才落盘）
- 取数路线（**环境约束，别照抄别的 `fetch-*-docs`**）：本机网络上 `git clone` 会被 **RST** ⇒ 只能走 **codeload tarball** + `tar -xzf`
- 取数面：`src/content/docs/paper/dev/**` —— 实测 **67 页 / 562 代码围栏行（≈281 块） / 140 个唯一 `jd:paper:` fqcn / 320 个引用点**
- Per-page provenance：每页 frontmatter 带 `source:`（含仓库相对路径）、`fetchedWith:`、`fetchedAt:`、`license:`
- **许可（两套，必须分开看）**：
  - 仓库**代码** = **BSD 2-Clause**（上游 `LICENSE`）
  - **文档正文** = **Creative Commons Attribution-ShareAlike 4.0 International（CC BY-SA 4.0）**（上游 `LICENSE-docs`）
- ⚠️ **ShareAlike 义务**：本仓 `data/paper_stable/**`（正文在 `data/paper_stable/paper-docs/stable/`）是对上游正文的**提取/改编**，因此该子树及其衍生文本必须
  **以 CC BY-SA 4.0 分发，并署名 PaperMC**；**不得**与本项目 `LICENSE`（MIT）或其他 `data/` 子树混为同一许可。
  单独取用 `data/paper_stable/**` 时必须保留本节的署名与许可声明。
- 版本口径：Paper 文档**不按 MC 版本分档**（是"当前"文档）⇒ 落 `data/paper_stable/paper-docs/stable/`（**伪版本 `stable`**；目录名须服从
  `versionDataDir` 的 `<platform>_<ver>/<source>/<ver>` 拼法，先例 = `data/bedrock_stable/bedrock-docs/stable/`）；
  版本轴另由 Javadoc（`jd.papermc.io/paper/`）承担。

### Spigot / Bukkit 与 Paper API —— **签名面**（Javadoc；平台 id `spigot` 与 `paper-api`，落 `data/spigot_stable/` · `data/paper-api_<ver>/paper-javadoc/<ver>/`）

- 取数器：`mcp-server/scripts/fetch-spigot-javadoc.mjs`（**默认 dry-run**，`--fetch` 才落盘；并发默认 8）
- 取数面：站点自带的 `type-search-index.js`（机读类清单）+ 各类页的 `member-signature` 块
- 落点与计数（实测 2026-10-14 / Paper 历史档实测 2026-10-23）：`data/spigot_stable/spigot-javadoc/stable/` = **1396 类**；
  `data/paper-api_stable/paper-javadoc/stable/` = **2116 类**（as-of `26.3.build.178-stable`）；
  另有五个**按真 MC 版本**分的 Paper 档（同一站点、同一取数器、`asOfVersion` 各自对钉）：
  `paper-api_1.21.4` = 1871 类（`1.21.4-R0.1-SNAPSHOT`）· `paper-api_1.21.1` = 1702（`1.21.1-…`）·
  `paper-api_1.20.1` = 1496（`1.20.1-…`）· `paper-api_1.16.5` = 1254（`1.16.5-…`）· `paper-api_1.12.2` = 877（`1.12.2-…`）。
  每页 frontmatter 带 `source:`（类页绝对 URL）、`sourceType: javadoc`、`fetchedWith:`、`fetchedAt:`、**`asOfVersion:`**（上游真实版本串）
- **Spigot 的八个版本档走的是另一条路（构件，不是 javadoc 页）**：`data/spigot_<ver>/spigot-javadoc/<ver>/` 由
  **`mcp-server/scripts/extract-spigot-api-surface.mjs`** 从 maven 构件 `org.spigotmc:spigot-api:<ver>-R0.1-SNAPSHOT`
  的 **`javap` 直读**生成（每页 `sourceType: javap` + `jarMd5`；`raw/` 存 `javap` 原文）。八档实测：
  `1.21.8` 1352 类 / `1.21.4` 1335 / `1.21.1` 1282 / `1.20.6` 1251 / `1.20.1` 1186 / `1.19.4` 1173 / `1.16.5` 1027 / `1.12.2` 779
  （成员签名 15284 / 15018 / 12784 / 12496 / 9440 / 9311 / 7875 / 6213）。目录名沿用平台的 `spigot-javadoc` 子目录
  （`PLATFORM_DOC_SUBDIR.spigot`），**不代表它是 javadoc HTML 抽取** —— 来源以 `sourceType` 与 `meta.json` 的
  `faceKind: signature-face-from-artifact` 为准。
- **版本口径（2026-10-24 再修正）**：分三块看，别混：
  - **Spigot 的 javadoc 页**：URL **没有版本轴**（`/javadocs/spigot/1.21.4/` 实测 404；`/javadocs/bukkit/` 与
    `/javadocs/spigot/` 返回同一份当前文档）⇒ 那一档只能落**伪版本 `stable`**（`data/spigot_stable/spigot-javadoc/stable/`）。
  - **Spigot 的构件**：maven 上**有版本轴**（`org/spigotmc/spigot-api` 的 `maven-metadata.xml` 实测 **83 个版本**）⇒
    八个历史档从构件 `javap` 抽（见上一条）。
  - **Paper 的 javadoc**：URL **有版本轴**（`jd.papermc.io/paper/<ver>/`，实测 26.3 / 1.21.8 / 1.21.4 / 1.21.1 /
    1.20.1 / 1.19.4 / 1.16.5 / 1.12.2 首页全 200）⇒ 历史档落 `data/paper-api_<ver>/paper-javadoc/<ver>/`，
    只有"当前文档"那一档保留伪版本 `stable`。

  真实版本串一律留在 `asOfVersion`（javadoc 档取自站点 `index.html` 的 `<title>`，取数器对 `--version` 做**双向对钉**，
  不一致即拒；构件档取自 maven 的 `<snapshotVersion>` 时间戳串 + `meta.json` 的 `artifact`/`jarMd5`）。
  复跑：javadoc 伪版本档 `--version <上游真实串> --pseudo-version stable --out data/<face>_stable/<face>-javadoc/stable`；
  javadoc 真版本档 `--version <ver>-R0.1-SNAPSHOT --pseudo-version <ver> --out data/paper-api_<ver>/paper-javadoc/<ver>`；
  Spigot 版本档 `node mcp-server/scripts/extract-spigot-api-surface.mjs --version <ver> --write`
- 许可与边界：
  - `SpigotMC/Spigot-API` 仓 = **GPL-3.0**（`LICENCE.txt`；仓库 **2021-12-28 已归档**，About 标注 "OUTDATED - SEE hub.spigotmc.org/stash"）
    ⇒ **本仓不抄其源码**；只把 **API 名字 / 签名**（事实面）当检索对象，与本仓 `loader-api` 同一条线。
  - **SpigotMC Wiki（`spigotmc.org/wiki/**`）不可入库**：实测**无任何开放许可声明**，页脚仅 `© 2012-2026 SpigotMC Pty. Ltd.`
    ⇒ 按本仓准入（要求宽松许可）一律不入 `data/`，只能走 `community_knowledge/links/`（仅标题 / 摘要 / 外链）。
    这也是 **Spigot 面无教程正文、只有签名面**的原因。
  - `data/paper-api_*/paper-javadoc/**`（含 `stable` 与五个真版本档）同为 Paper 的 API 签名面，跟随上游 Paper/Spigot 条款；
    **与 `data/paper_stable/paper-docs/`（CC BY-SA 4.0）不是同一许可** —— 2026-10-14 起两棵树分属
    不同平台 id（`paper-api` vs `paper`）且**不在同一目录**，单独取用时请按子树区分。
  - **GPL-3.0 构件的派生签名面（2026-10-24 登记）**：`data/spigot_<ver>/spigot-javadoc/<ver>/` 的八个历史档是从
    **GPL-3.0 的 `spigot-api` 构件**经 `javap` 抽的签名清单（生成器 `extract-spigot-api-surface.mjs`）。
    边界与上面 LiteLoader 那段同类：
    - **入库的**：类型名、成员签名（修饰符 / 返回类型 / 名 / 参数类型 / `throws`）、枚举常量名 —— 即「这个名字与这个形状存在」的事实，不含表达。
    - **不入库的**：构件本身（下载落 `temp/spigot-jars/`，gitignored）、方法体、注释与 javadoc 散文、初始化值、任何实现逻辑。脚本取不到形参名与注解 `default` 值（class 文件无 `MethodParameters`、`javap` 不带 `-v`），每份产物头部已写明这条限制。
    - **风险状态**：签名集合的版权地位在各法域仍有争议（**不存在**「签名不受版权保护」的定论）；**GPL-3.0 的传染性是否延及「从构件抽出的接口清单」同样没有定论**。本节登记的是**已知并接受的最小化派生**，**不构成再分发授权**，也不改变上游 GPL-3.0 状态；若权利人要求移除，删 `data/spigot_<ver>/` 与生成器脚本即可，不动其它数据面。
  - **真机探针用的服务端件不入库（2026-10-24 登记）**：Spigot 官方**只发 BuildTools 源码、不发成品 jar**
    （`hub.spigotmc.org/nexus/.../org/spigotmc/spigot/maven-metadata.xml` 实测 404），所以
    `mcp-server/scripts/playtest-spigot-server.mjs` 的服务端件取自 **getbukkit 第三方镜像**（`download.getbukkit.org`），
    落 F 盘沙箱、**不入库、不由本仓背书**；三档件的字节数与上游 `content-length` 逐一核过
    （1.19.4 = 71,219,629 · 1.20.6 = 76,012,205 · 1.21.8 = 84,523,129）。Paper 侧的探针件来自官方
    `fill.papermc.io/v3`，sha256 逐字核过，同样不入库。

## Minecraft Bedrock creator documentation（`data/bedrock_stable/`）

- Source: **Microsoft Learn — Minecraft docs**（`https://learn.microsoft.com/en-us/minecraft/creator/`），由 `mcp-server/scripts/fetch-bedrock-docs.js` 按该站 `toc.json` 页清单抓取
- Per-page provenance: 每页头部三行引用头（来源 URL / 抓取时间 / 滞后警告）+ `data/bedrock_stable/bedrock-docs/stable/fingerprints.json`（上游 `gitcommit` 40 位 sha 与 `updated_at`）+ `bedrock-docs-status.json`（`localRevision` / `remoteRevision` / `stale` 三态）
- License / terms: Microsoft documentation license（见 https://learn.microsoft.com/en-us/legal/terminology 与页面页脚条款）；本仓库只存文本摘录用于离线开发辅助
- Trademark: Minecraft / Bedrock 均为 Mojang Synergies AB 商标，本项目与 Microsoft / Mojang 无关联

## `@minecraft/server` TypeScript 声明摘录（`data/bedrock_stable/bedrock-scriptapi/stable/processed/scriptapi/`）

- Source: **npm 包 `@minecraft/server` 的 `index.d.ts`**（版本取自 `bedrock-docs-status.scriptApiStable`，本轮为 2.9.0），由 `mcp-server/scripts/fetch-bedrock-script-api.mjs` 解析为「一声明一页」
- Tree: 这一族自 2026-09-21 起**独立成第二棵基岩语料树** `bedrock-scriptapi/`，不再混在 Learn 文档树 `bedrock-docs/` 的 `processed/scriptapi/` 下 —— 两种体裁（教程页 vs 逐声明页）正文厚度差一个数量级，混树时厚度地板只能签到两者交集，等于没有地板；`search_bedrock_docs` / `get_bedrock_doc_*` 同时读两棵树并按 id 去重（两树 id 前缀不同，实测零重叠）
- Retrieval: unpkg → jsdelivr → registry tarball（`scripts/_lib/fetch-with-ua.mjs`，curl 优先）；`sha256` / `integrity` / `unpackedSize` 记在 `scriptapi-typed.json` 与 `bedrock-docs-status.json`
- **源文件原文不入库**：`index.d.ts` 全文只落被 gitignore 的 `mcp-server/scripts/_temp/`；仓库内产物为逐声明摘录 + 出处头（`find data -name '*.d.ts'` 实测 0 命中）
- Copyright: 源文件头为 **Microsoft Corporation** 版权声明；每个产物页头部保留该声明片段并标注「出处：npm @minecraft/server@<ver> 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）」
- License: follow the package's published license（以该 npm 版本自带声明为准）

## Quilt 开发者文档与规范（`data/quilt_*/`）

- Source: **https://github.com/QuiltMC/developer-wiki**（取 `wiki/<路径>/en.md` 的 markdown 本体）、`QuiltMC/quilt-standard-libraries` 各分支 README、`QuiltMC/rfcs` 的 `specification/0002-quilt.mod.json.md`
- Fetcher: `mcp-server/scripts/fetch-quilt-docs.js`（经 `raw.githubusercontent.com`）
- 说明：正文源已从 `wiki.quiltmc.org` 的 HTML 换成上游仓库 markdown —— 该站是 SvelteKit 壳，服务端 HTML 只有数百字符，旧抓取器落入 `body` 兜底后会把整棵导航菜单灌进语料
- License: follow QuiltMC terms（各仓库自述 license；QSL 各模块另按分支 README）

## LiteLoader wiki（`data/liteloader_*/`）

- Source: **https://www.liteloader.com/explore/docs/**（MediaWiki，正文经 `_export/raw` 取 wikitext）
- Fetcher: `mcp-server/scripts/fetch-liteloader-wiki.js`
- License: follow LiteLoader project terms（该 wiki 的页面授权以其自述为准）

## LiteLoader 1.12.2 源码树（`ll-src/`）

- **Source**：`https://develop.liteloader.com/liteloader/LiteLoader` 的 `1.12.2` 分支；本机工作区的未跟踪树 370 个文件（363 个 `.java` + 资源/元数据），其中 `ll-src/liteloader.properties` 的 `brand=1.12.2-SNAPSHOT-r4CC2BB0-b4-4` 可作为该次取件的版本标识。
- **Copyright**：文件头逐字为 `Copyright (C) 2012-16 Adam Mummery-Smith` + `All Rights Reserved`（363 个 Java 文件中 327 个带该头；其余文件无独立许可头，按同一项目版权处理）。上游站点页脚亦为 `Copyright © 2014-26 Adam Mummery-Smith` / `All Rights Reserved`。
- **License / 边界**：上游**没有给出开放许可**，`All Rights Reserved` 不构成再分发授权。该树已从 git 索引移除（`.gitignore` 的 `ll-src/` 排除），工作区里的副本只作**本地对照**（类名/签名核对）；**不得**把它打进 GitHub Release、`data/` zip、npm 包或任何对外分发包，也**不得**把其中的源码复制进 scaffold / 生成器 / 文档正文。本登记只记录来源、版权与边界，**不授予任何权利，也不改变上游的 All Rights Reserved 状态**；若权利人要求移除，应删除工作区副本及依赖它的对照记录。
- **与既有自述的关系**：`mcp-server/data/loader-api-summaries/1.12.2-liteloader.json` 的 `source` 字段写「许可证禁止把 loader 源码再分发进仓库」——该句描述的是上游条款；本节登记的本地副本是**已知的例外/风险项**，不是许可授权。二者不应被读成「已获许可」。
- **可核对的派生事实**：`liteloader/1.12.2/knowledge/common/verified-api.md` 里的接口名/签名来自真构件 `liteloader-1.12.2-SNAPSHOT.jar` 的 `javap`；源码树只作交叉对照，不是可分发正文。
- **派生的签名面（2026-10-22 登记，三档）**：`liteloader/<1.12.2|1.10.2|1.8.9>/knowledge/common/api-surface.md` 是**入库**的签名面，由 `mcp-server/scripts/extract-liteloader-api-surface.mjs` 生成。**主路线是构件 `javap` 直读**（不是源码树推断），源码树只作 1.12.2 的交叉对照。三档的构件与核验值：

  | 档 | 构件 | md5 | 与登记值对钉 | vanilla 类型 | 产物口径 |
  |---|---|---|---|---|---|
  | 1.12.2 | `liteloader-1.12.2-SNAPSHOT.jar`（本机 ForgeGradle **deobf 解析件**） | `23fa4a38…` | ❌ 不等于上游发布件 `1420785e…`（deobf 重打包所致） | MCP 可读 | 73 类型 / 249 签名 |
  | 1.10.2 | `liteloader-1.10.2.jar`（`F:\MC_GAME\_oracle-jars\` 本机留档，亦可自 `dl.liteloader.com` 取回） | `8a7c21f3…` | ✅ 与 `versions.json` 的 RELEASE 记录逐字一致 | **混淆名**（`bcx`/`ey`/…） | 72 类型 / 230 签名 |
  | 1.8.9 | `liteloader-1.8.9-20160414.153538-10.jar`（同上留档） | `12cbdc8c…` | ✅ 与本档 `verified-api.md` 登记值一致 | MCP 可读 | 70 类型 / 209 签名 |

  它与上文「不得把源码复制进 scaffold / 生成器 / 文档正文」是同一件事的两个面，边界如下：
  - **入库的**：类型名、成员签名（修饰符 / 返回类型 / 名 / 参数类型 / `throws`）、枚举常量名 —— 即「这个名字与这个形状存在」的事实，不含表达。构件路线**拿不到**形参名与注解 `default` 值（class 文件不带 `MethodParameters`、`javap` 不带 `-v`），这是它相对源码树的唯一信息损失，产物头部已写明。
  - **不入库的**（脚本内写死，`--selftest` 4 例守着「注释 / 初始化值 / 方法体不得泄漏」）：注释与 javadoc 散文、方法体与 `default` 实现、字段与常量的初始化值、任何实现逻辑、以及**构件与源码树本身**。
  - **证据等级**：构件路线与 `verified-api.md` 同源同级，但**未经人工逐字复核**；三份产物头部都写明「不得当作可输出给用户的已核实名单」，两处冲突以 `verified-api.md` 为准。1.10.2 的 vanilla 类型名是混淆名，该档只证「类名 / 方法名 / 元数」。
  - **风险状态**：签名集合的版权地位在各法域仍有争议（**不存在**「签名不受版权保护」的定论）。本节登记的是**已知并接受的最小化派生**，**不构成再分发授权**，也不改变上游 ARR 状态；若权利人要求移除，删这三份 md 与生成器脚本即可，不动其它数据面。
- **⚠️ 树内含第三方服务凭据（2026-10-21 登记）**：`ll-src/com/mumfrey/liteloader/util/net/PastebinUpload.java:36` 有硬编码的 `PASTEBIN_API_KEY`，`ll-src/com/mumfrey/liteloader/util/net/LiteLoaderLogUpload.java` 同族另有一处。性质判定：① 属**上游源码原样内容**，不是本项目引入的凭据；② 该 dev key 随上游公开源码发布，上游自身未作秘密管理；③ `ll-src/` **已从 git 索引移除**（本节上文），因此该串**不随本仓库分发**。处置：**不修改上游源码**（改了就不再是与上游可对照的副本）、**不复制进任何生成物或文档**、**不实际使用**；若日后需要启用 LiteLoader 内建的日志上传能力，须由使用者自备自己的 key。本节登记即为此项的记录位。

## Fabric documentation and Wiki extracts

- Fabric Docs: https://github.com/FabricMC/fabric-docs
- Fabric Wiki: https://fabricmc.net/wiki/
- Typical local paths: `data/fabric_*/fabric-docs/`、`data/fabric_*/fabric-wiki/`
- License: follow FabricMC / page-specific terms

## Yarn mappings

- Upstream: Fabric Yarn (Maven `net.fabricmc:yarn`) / https://fabricmc.net/wiki/documentation:yarn
- Typical local artefacts: `yarn-*.jar`、`yarn-*-tiny.gz`、`yarn-mappings.json`、generated `yarn-mappings.sqlite`
- License: **CC0-1.0**（2026-10-04 核实：FabricMC/yarn 自述 "open, unencumbered Minecraft mappings, free for everyone to use under the Creative Commons Zero license"，GitHub License 标识 CC0-1.0；同门 `FabricMC/intermediary` 亦为 CC0-1.0）
- Note: the MCP server must use **SQLite point lookups** at runtime; do not treat the full JSON as a redistributable “load everything” database API

## Vanilla registry ID dumps（`data/vanilla_*/registries/`）

- Default build path: [PrismarineJS/minecraft-data](https://github.com/PrismarineJS/minecraft-data) via jsDelivr (`npm run fetch:vanilla-registries`)
- Alternate: official Minecraft data-generator `reports/` (`--from-reports=<dir>`)
- License: minecraft-data is MIT; Mojang registry IDs are game content names
- See also `data/vanilla_ATTRIBUTION.md`

## Parchment mappings

- Upstream: https://parchmentmc.org / https://github.com/ParchmentMC
- Typical local paths: `data/*/mappings/parchment*.json` / related zips
- License: follow ParchmentMC terms

## MCP (Mod Coder Pack) historical mappings

- Used for older Forge versions where applicable (`data/forge_*/mappings/` etc.)
- Follow historical MCP redistribution terms

## NeoForge documentation / primers

- Upstream: https://docs.neoforged.net / https://github.com/neoforged
- Typical local paths: `data/neoforge_*/`（及文档子目录）
- License: follow NeoForged terms
- Note: some NeoForge `1.20.1` doc queries may surface Forge 1.20.1 content via a compatibility fallback in this tool

## Code reuse（MIT，适配改写）

| 来源 | 借用内容 | 落点 |
|------|---------|------|
| [MCDxAI/minecraft-dev-mcp](https://github.com/MCDxAI/minecraft-dev-mcp)（MIT） | CLI flags-only / coerceFlagValue / `{success,tool,result\|error}` / isMainModule；反编译与 Mixin 字节码校验思路参照 | `mcp-server/src/cli.ts`、`src/decompile/`、`src/mixin/`（适配改写，非整体拷贝） |
| [OGMatrix/mcmodding-mcp](https://github.com/OGMatrix/mcmodding-mcp)（MIT） | 文档分块（title/section/code/full）与 RRF 混合检索思路 | `mcp-server/src/docs-platform/semantic/`、`scripts/_lib/build-semantic-index.mjs` |

遵守 MIT 许可：以上借用保留原作者版权声明与本署名；原项目 License 见其 GitHub 仓库。

## Runtime Java tools（按需下载至 `$MC_SKILL_CACHE/resources/`，不进 git）

| 工具 | License | 用途 |
|------|---------|------|
| [VineFlower](https://github.com/Vineflower/vineflower) | LGPL-3.0 | MC / 模组 jar 反编译 |
| [Fabric tiny-remapper](https://github.com/FabricMC/tiny-remapper) | Apache-2.0 | official→intermediary→named / mojmap 重映射 |

分发时保留本通知；LGPL 工具以独立 jar 形式按需下载，不静态链接进本仓库代码。

## Release assets

When publishing or mirroring:

1. Keep this file with any full `data/` zip.
2. Prefer verifying downloads with `SHA256SUMS-*.txt`（checksum entries use **bare filenames**, matching GitHub Release asset names such as `data-manifest.json`）.
3. Do not strip upstream attribution from regenerated indexes if your redistribution policy requires retaining provenance metadata (`meta.json`、manifests、fetch URLs / hashes).

## Disclaimer

Minecraft is a trademark of Mojang Synergies AB. This project is not affiliated with Mojang, Microsoft, Forge, FabricMC, or NeoForged. Documentation and mappings are provided for offline developer assistance; redistribute only in accordance with each upstream project’s license.

## Community knowledge（`community_knowledge/`）

本仓库另含社区实务知识库（与 `data/` 官方文档分离）：

| 来源 | 说明 |
|------|------|
| MC百科教程（耿悠博） | 《如何制作并且维护你的mod？（Forge，1.18–1.20）》；作者评论区约 51 楼「随意吧」许可收录提炼。原文：https://www.mcmod.cn/post/3993.html 。详见 `community_knowledge/ATTRIBUTION.md`。 |
| 仅外链（禁转载） | 例：https://www.mcmod.cn/post/6071.html（Kadar_Visico 工程化指南）→ `links/` stub，正文不入库。 |
| 本仓库自写短文 | `community_knowledge/authored/`（发布、崩溃、软依赖、创造页签、工程结构、注册 helper、机器/GUI/BE/Capability、多面模型、开发环境、本地化、CurseMaven 等）；Agent 用法见 `community_knowledge/AGENT_USAGE.md` |
| 外链 stub | `community_knowledge/links/`（仅 URL，无网页正文入库） |

社区内容经 MCP `search_community_docs` 等工具查询；**API / 注册细节仍以官方 Forge/Fabric/NeoForge 文档工具为准**。

## 派生映射表与 API 摘要库（`data/_*-pairs/` · `data/forge_*/mappings/srg_to_official-*.tsrg` · `mcp-server/data/*-api-summaries/`）

本节补登**已在 git 索引里、但本文件此前一字未提**的四族第三方派生物（`git ls-files` 可逐件点开）。它们都不是本项目自写内容，而是从第三方映射表 / 上游 class 与 sources 构件派生出来的。

数字口径：每条都带 **as-of 2026-09-27** + 复核命令，且给了第二把独立尺子（`git ls-files | tr | xargs -0 wc -c` 枚举 vs `find -printf '%s' | awk` 枚举，两机制同数才落笔）。证据档：**语料逐字**（本仓内可打开核对）/ **处方-only**（只有本仓自写文档这么主张）/ **外部-only**（本仓没有可核对的副本）。**本节不下任何法律结论**，只写「发了什么、从哪来、上游自述条款怎么记、本仓没清什么」。

### 1. 四张类名对照表（`data/_*-pairs/`）

- 盘面：**4 目录 / 43 tracked 件 / 48,002,872 B / 200,872 条类名对**
  - 复核：`git ls-files data/_yarn-mojmap-pairs data/_qm-yarn-pairs data/_mcp-feather-pairs data/_mcp-legacyyarn-pairs | wc -l` → 43；同清单接 `| tr '\n' '\0' | xargs -0 wc -c | tail -1` → `48002872 total`；第二机制 `find <同四目录> -type f -printf '%s\n' | awk '{s+=$1;n++} END{print n, s}'` → `43 48002872`
  - 分档件数 / 字节（两机制同数）：`_yarn-mojmap-pairs` 17 件 / 27,196,860 B · `_qm-yarn-pairs` 8 件 / 11,269,611 B · `_mcp-feather-pairs` 9 件 / 4,776,300 B · `_mcp-legacyyarn-pairs` 9 件 / 4,760,101 B
  - 对数第二机制：逐件 JSON 的 `count` 字段求和 与 `pairs` 数组长度求和分别独立解析，两侧相等（112,971 / 46,323 / 20,789 / 20,789）
- **每行只有类名，没有成员名**：`data/_yarn-mojmap-pairs/yarn-mojmap-1.20.1.json` 的行键集实测恰为 `{obf, mojmap, yarn, mojFqcn, yarnFqcn}`；另三族同形（第二/三名分别换成 `quiltMappings` / `feather` / `legacyYarn`）。⇒ 派生表，**不是任何上游文件的原样拷贝**。
- 一表一个生成器，且**按设计从不写仓库**（默认落 `$MC_SKILL_CACHE/<族>-pairs`；`build-qm-yarn-pairs.mjs` / `build-mcp-feather-pairs.mjs` / `build-mcp-legacyyarn-pairs.mjs` 走 `scripts/_lib/write-guard.mjs` 的 scratch 出口，落仓库即 throw）。目录内那份 `*-pairs-provenance.json` 是**人工发布副本的凭据**，逐件钉 sha256：本轮实测 39 件（16 + 7 + 8 + 8）全对、`mismatch=0`、无「在盘未钉」件（**语料逐字**）。

| 目录 | 对照的两层 | 生成器 | 覆盖 / 对数 | 上游原文件是否入库 | 许可姿态（本仓记录） |
| --- | --- | --- | --- | --- | --- |
| `data/_yarn-mojmap-pairs/` | Fabric **Yarn** ↔ Mojang 官方映射（mojmap） | `mcp-server/scripts/build-yarn-mojmap-pairs.mjs` | 15 档 / 112,971 | mojmap 侧 `client.txt` **不入库**（下条）；yarn 侧读已入库的 `data/fabric_<v>/mappings/yarn-mappings.sqlite` | 见下条 + 本文件「Yarn mappings」节「follow Yarn / FabricMC mapping license terms」 |
| `data/_qm-yarn-pairs/` | **QuiltMappings** ↔ Yarn | `mcp-server/scripts/build-qm-yarn-pairs.mjs` | 6 档（1.18.2–1.21.11）/ 46,323 | QM 的 `-mergedv2.jar` 不入库（内存解 `mappings/mappings.tiny`） | provenance `license`：QuiltMappings = **CC0-1.0**（引 QuiltMC/quilt-mappings README 自述 ⇒ 上游那句本身**外部-only**） |
| `data/_mcp-feather-pairs/` | **MCP**（srg/tsrg）↔ **Feather**（Ornithe） | `mcp-server/scripts/build-mcp-feather-pairs.mjs` | 7 档（1.7.10–1.13.2）/ 20,789 | Feather jar 不入库；MCP 侧 `joined.srg` / `joined.tsrg` 本仓早已入库 | provenance `license`：Feather = **CC0**（引 OrnitheMC/feather「open, unencumbered … Creative Commons Zero」） |
| `data/_mcp-legacyyarn-pairs/` | **MCP**（srg/tsrg）↔ **Legacy Fabric yarn** | `mcp-server/scripts/build-mcp-legacyyarn-pairs.mjs` | 7 档（1.7.10–1.13.2）/ 20,789 | 同上 | provenance `license`：Legacy-Fabric/yarn = **CC0-1.0** |

- **Mojang `client.txt` 为什么在 git 里查无（关键取舍）**：`git ls-files | grep -c 'client\.txt'` → **0**。排除规则在 `.gitignore:50 data/**/mappings/client.txt`，`git check-ignore -v data/forge_1.20.1/mappings/client.txt` 抓到该行。工作树里该件**实存 6 份**（`find data -name 'client.txt' -printf '%s %p\n'` → 5,746,047 / 6,437,531 / 6,716,693 / 7,844,191 / 8,001,795 / 8,897,012 B，1.16.5→1.20.4），**只在盘、不在 git**，干净 clone 拿不到。文件头第一行**节引**（上游那一行是一整串不断行的声明，此处中间以 `…` 省略；须在本机该件上 `head -1 data/forge_1.20.1/mappings/client.txt` 才看得到 ⇒ **外部-only**）：`# (c) 2020 Microsoft Corporation. These mappings are provided "as-is" … You may copy and use the mappings for development purposes, but you may not redistribute the mappings complete and unmodified.` —— 本仓据此只提交「按 obf 短名 join 出来的类名对照」，不提交原表。
- 消费方：`_yarn-mojmap-pairs` 是 `mcp-server/scripts/assert-skill-mappings-key.mjs`（leg2）与 `assert-cross-layer-names.mjs` 的默认对照源（落点序「仓库副本 → `$MC_SKILL_CACHE/yarn-mojmap-pairs` → tmpdir」）。另三族 provenance 的 `consumedBy` 一律写「暂无门/工具消费（数据资产）」⇒ **入库只为互查命名，不为出门判据**。
- Skill 正文口径不受影响：仍只写逐件用到的少数名字，**不得整段抄表**（根 `AGENTS.md` §「Fabric ≤1.21.11」）。

### 2. Forge 1.16.5–1.20.4 的 SRG ↔ 可读成员名削减件（6 份 tsrg）

- 盘面：**6 件 tracked / 32,273,362 B / 477,798 行，其中缩进成员行 437,279 行**
  - 清单：`git ls-files 'data/forge_*/mappings/*.tsrg' | grep srg_to_official` → 6 行（1.16.5 / 1.17.1 / 1.18.2 / 1.19.4 / 1.20.1 / 1.20.4）
  - 字节两机制：`ls data/forge_*/mappings/srg_to_official-*.tsrg | tr '\n' '\0' | xargs -0 wc -c` → `32273362 total`；`find data -path '*/mappings/srg_to_official-*.tsrg' -type f -printf '%s\n' | awk` → `files=6 bytes=32273362`
  - 成员行两机制：逐档 `grep -c $'^\t'` → 55,367 / 66,429 / 69,600 / 79,668 / 80,654 / 85,561（合计 437,279）；单趟 `awk '/^[ \t]/{m++} {t++} END{…}'` 一次读六件 → `member_lines=437279 total_lines=477798`
  - 形状：`tsrg2 srg official` 头 + 类行 `<srgClass> <officialClass>` + **制表符**缩进成员行 `\t<srgName>\t<descriptor>\t<officialName>`（字段行的描述符位是空串）
  - 成员名两年代：1.17.1–1.20.4 五档 = `m_` 230,038 + `f_` 151,874 = 381,912；1.16.5 一档 = `func_` 35,526 + `field_` 19,841 = 55,367；两代相加 = 437,279
- Source: `de.oceanlabs.mcp:mcp_config`（`https://maven.neoforged.net/releases/de/oceanlabs/mcp/mcp_config/`），取件自本机 ForgeGradle 缓存，由 `mcp-server/scripts/ingest-forge-srg.mjs` 削减后落盘；建库侧 `mcp-server/scripts/_lib/import-srg-to-official.mjs`（`mappingEra=mcp-config-srg`）。
- **不是上游件原样**（**语料逐字**：同目录六份 `mcp_config-<v>-<ts>.provenance.json`，合计 14,007 B）：以 1.20.1 为例，上游件 9,129,100 B / `sourceLines` 212,140 → 入库件 6,027,347 B，`droppedLines` = 参数行 90,053 + 修饰行 18,037 + `<init>`/`<clinit>` 9,637 + 其他 6,321。六份都带 `licenseNote` 字段，主张与第 1 条同一句 Mojang「complete and unmodified」措辞。
- ⚠️ **政策一致性待答（登记分歧，不下结论）**：本文件第 1 条的取舍是「**类名级**派生对照可入库、**完整未修改**的原表不入库」。本节六份入库件带的却是**成员级**可读名对 437,279 行（另附描述符），与 `client.txt` 的差别只有「削减 + 换层（SRG 而非 obf）」。⇒ 同一句理由下，**类名对照被排除、成员名对照被收录**，而这两条口径此前没有在任何署名文件里被对齐说明过。要么把「削减后的派生件另档看待」的判据写清（现只有六份 provenance 的 `licenseNote` 字段——由 `ingest-forge-srg.mjs` 写出——与 `CONTRIBUTING.md` 台账在主张），要么这六份与 `client.txt` 同档处理（降级到 `$MC_SKILL_CACHE`、只留 provenance）。**本文件只登记这个不一致，不代裁。**

### 3. API 摘要库（`mcp-server/data/loader-api-summaries/` · `mcp-server/data/lib-api-summaries/`）

两族都是**上游 class / sources 构件的派生摘要**；上游 jar 与反编译出的 `.java` 都不入库。

| 目录 | tracked 件 / 字节 | 内容 | 生产者与供件路径 | 许可姿态（本仓记录） |
| --- | --- | --- | --- | --- |
| `mcp-server/data/loader-api-summaries/` | 73 件 / **99,512,010 B**（旁证 `du -sm` → 95，按块进位，与精确字节不同口径） | 55 件 `<MC版本>-<加载器>.json` 签名摘要（类 44,567 / 方法 200,450 / **字段 0**）+ `index.json` + `README.md`（人工覆盖台账）+ `status.json` + `skipped-ingest.json` + `extracted-classes.json` + 5 份 `*-last.json` 运行快照 + `sidecar-templates/`（8 件 = 7 件 `.sidecar` + 该目录 `README.md`） | `scripts/fetch-loader-api-jars.mjs` 从**已解压 MDK 的 `gradle.properties` / `build.gradle` 读 maven 坐标**下 jar 到 `$MC_SKILL_CACHE/loader-jars`（jar 不入库）→ `scripts/decompile-loader-apis.mjs` 抽摘要写本目录 | 逐档 maven 坐标记在该目录 `README.md` 的覆盖表（例 `net.neoforged:neoforge:20.4.251`、`net.neoforged:forge:1.20.1-47.1.106`）+ 各 JSON 的 `sourceJarSha256` ⇒ **语料逐字**；各加载器自身条款按上面对应平台节处理 |
| `mcp-server/data/lib-api-summaries/` | 48 件 JSON / **39,823,211 B**（旁证 `du -sm` → 39） | 库模组（Cloth Config / GeckoLib / Patchouli / CCA / Trinkets / JEI…）的类与包清单：classCount 合计 114,708 / methodCount 545,127 / 版本键 824 | `scripts/build-api-summaries.mjs` 读 `$MC_SKILL_CACHE/decompiled-mods/<modId>/<modVersion>/**/*.java`；库清单 = `mcp-server/src/diagnostics/library-catalog.ts` 的 `LIBRARY_CATALOG`（`modrinthSlug`），版本面由 `scripts/build-lib-manifest.mjs` 打 Modrinth API 得 | 各库自述许可随其发布物；**本仓没有这 48 个库的 license 文本副本**（`git ls-files data mcp-server/data | grep -ci license` → 0）⇒ **外部-only**，逐库回其 GitHub / Modrinth 页查 |

- **供件人 = 维护者侧管道，不是用户上传物**：`loader-api-summaries` 的 55 件槽摘要里 **48 件 `source: "official"`**，7 件非 official（4 件 `qsl-github-java`、1 件 `official-raw`（rift）、1 件 `1.12.2-liteloader`、1 件 `1.6.4-modloader`）。其中 `1.12.2-liteloader.json` 的 `source` 字段本身就是一句许可说明（原文：**「GitLab 1.12.2 已打开接口（许可证禁止把 loader 源码再分发进仓库）」** ⇒ 该档摘要 classCount 只有 6，不是 jar 全量摘要；该句与 `ll-src/` 本地副本的关系见上文「LiteLoader 1.12.2 源码树」节，不要把副本读成许可授权）；`1.6.4-modloader.json` 写 `safe-api.md (MCP named / public ModLoader API)`（2 类）。
- 用户自备 jar 那条腿**不进仓库**：`ingest_loader_api` 的摘要只写 `$MC_SKILL_CACHE/loader-api-summaries/` overlay。该目录 `sidecar-templates/README.md` 明写「官方**不会**下载这些 jar（许可 / 无 Gradle 坐标）……摘要只写 overlay，**禁止**提交进仓库 `data/`」；`mcp-server/test-core.mjs` 的 hygiene 腿把「`source: user_jar` 落进官方目录」判红（判据清单见该目录 `README.md` §失败不落盘）。
- 摘要能力边界（影响署名判断）：**`fields` 恒为 0**（本轮 38 件实测合计 0）⇒ 这两族答不了静态字段名（如 `ForgeRegistries.BLOCKS` 一类），字段名仍须按根 `AGENTS.md` 的四档出处落笔。

### 4. NeoForge 语料的出处面（实测更正一处常被误说的说法）

「`data/neoforge_<ver>/` 没有逐页出处」这句**不成立**；「**没有 sidecar 清单**」成立。实测（as-of 2026-09-27）：

- 目录：`ls -d data/neoforge_*/` → 10 个，其中 **9 个 MC 版本档**（1.20.4 / 1.20.6 / 1.21.1 / 1.21.3 / 1.21.5 / 1.21.8 / 1.21.10 / 1.21.11 / 26.1）+ 第 10 个 `data/neoforge_primers/`（跨版本 primer 树，不是版本档）。`data/neoforge_1.20.1` 不存在 = 按设计（该版走 Forge 语料，见上文「NeoForge documentation / primers」节的 Note）。
- sidecar：**0**。`for d in data/neoforge_*; do find "$d" \( -iname '*manifest*' -o -iname '*provenance*' \); done` → 十目录各 0 命中；`git ls-files data` 里 `data/neoforge_<ver>/` 名下无一件 manifest/provenance（**只有**顶层 `data/neoforge-versions-manifest.json`，那不是逐页出处文件）。
- 但**页级内联出处在 `raw/` 树**：`data/neoforge_*/neoforge-docs/<ver>/raw/*.md` **627/627** 件首行为 `---`，frontmatter 含 `url:`（该页 docs.neoforged.net 绝对地址）+ `pageId:` + `version:` + `fetchedAt:`；生产者在 `mcp-server/scripts/fetch-neoforge-docs.js`（`fetchedAt` 拼装行 `:635`）。检索实际读的 `processed/` 一侧 **627 件全部无 frontmatter** ⇒ 出处只活在 raw，命中里看不到。
- 另有两处粗粒度清单：`data/neoforge-versions-manifest.json`（`docBaseUrl` + 每版 chapters/href + `available` / `httpStatus`）与每版 `…/neoforge-docs/<ver>/upstream-sitemap.json`（9 件）。
- 同一 `git ls-files data` 口径下别家有什么（现扫）：`data/forge_<v>/forge-docs/_manifest.json` **6** 件（逐页 `url` + `fetchedAt` + `size`）、`data/forge_1.20.4/forge-docs/_provenance.json` **1** 件、`data/forge_<v>/mappings/mcp_config-*.provenance.json` **6** 件、`data/fabric_<v>/mappings/yarn-tiny-provenance.json` **13** 件、`data/fabric_<v>/reference.provenance.json` **7** 件、`data/vanilla_<v>/registries/manifest.json` **2** 件、`data/bedrock_stable/bedrock-docs/stable/fingerprints.json` **1** 件；**quilt / liteloader / rift / modloader 四家侧车各 0 件**。
- ⇒ 缺口按「**无 sidecar、有页级内联头**」登记。要补的是把 `raw/` 的 `url` / `fetchedAt` 汇成一份 Forge 形状的 `_manifest.json`，**不是**重抓上游，也不是宣称「NeoForge 语料无出处」。

### 5. `data/*/mappings/.gitkeep` 里的外部源指针与陈旧 TODO

- 盘面：`git ls-files data | grep '\.gitkeep'` → **24 件 / 884 B**（`| tr '\n' '\0' | xargs -0 wc -c | tail -1` → `884 total`；第二机制逐件 `stat -c %s` 求和 → `files=24 bytes=884`）。其中 **22 件 0 B**，只有 2 件有正文，且都在 `*_1.20.1/mappings/`。
- `data/forge_1.20.1/mappings/.gitkeep`（259 B）正文逐字：

```
# Minecraft Forge 1.20.1 Mappings
#
# 下载来源：
#   https://mappings.xhyrom.dev/1.20.1/
#   https://parchmentmc.org/docs/getting-started
#
# 文件格式：Parchment 官方发布格式（.zip 解压后的 CSV/JSON）
#
# TODO：下载并放入此目录
```

  - **`https://mappings.xhyrom.dev/` = 第三方镜像指针**（该域名不属本文件「Parchment mappings」节点名的上游 `https://parchmentmc.org` / `https://github.com/ParchmentMC`，也不属同目录另一件 `.gitkeep` 点名的 `https://maven.parchmentmc.org/`）。它不只是躺在 `.gitkeep` 里：`git grep -c xhyrom -- mcp-server/src` → `src/version/index.ts` **6** 处（各版 `links.parchmentMappings`）+ `src/api/index.ts` **1** 处（`query_api` 未命中时打给用户的反查提示）。⇒ 现登记为**本仓库指向的外部源**：本仓不分发该站任何内容，用户按该站自述条款自行访问（**外部-only**）。
  - 那句 `# TODO：下载并放入此目录` **已陈旧**：同目录现已 tracked `parchment.json` / `parchment-1.20.1-2023.09.03.zip` / `srg_to_official-1.20.1.tsrg` / `yarn-mappings.sqlite` / `mcp_config-1.20.1-20230612.114412.provenance.json`（`git ls-files data/forge_1.20.1/mappings` 可点）。本节只登记该状态，**未改 `.gitkeep`**（`data/**` 属只可排除 + 注记面）。
- `data/fabric_1.20.1/mappings/.gitkeep`（625 B）正文逐字：

```
# Fabric 1.20.1 Mappings

下载来源：
  Fabric Maven: https://maven.fabricmc.net/net/fabricmc/yarn/
  Parchment Maven: https://maven.parchmentmc.org/

文件说明：
  yarn-*.jar         — Yarn mappings JAR（内含 mappings.tiny）
  yarn-*.tiny.gz    — Yarn Tiny 格式压缩包
  yarn-*.sources.jar — Yarn Minecraft 源码
  parchment-*.zip    — Parchment 参数名 + Javadoc

解析产出：
  yarn-mappings.json      — Yarn Tiny 解析后的双向索引（named ↔ official ↔ intermediary）
  parchment-params.json   — Parchment JSON（类参数名 + Javadoc，与 Forge parchment.json 同格式）
```

  - 两个 URL 都是**官方** maven，已由上文「Yarn mappings」与「Parchment mappings」两节覆盖，不另立镜像条目。该文件点名的两件「解析产出」（`yarn-mappings.json` / `parchment-params.json`）**确在同目录 tracked**（`git ls-files data/fabric_1.20.1/mappings`），只是现盘另多了一件 `.gitkeep` 未提及的 `yarn-mappings.sqlite`（运行时用的那件，见「Yarn mappings」节 Note：必须 SQLite 点查）。

### 6. 上游原样 gzip 的保留件（`data/fabric_*/mappings/upstream/*.bak`）

这一族的实况（本轮两机制实测，as-of 2026-09-27 UTC 06:3x）：

- **13 件**，逐档一件，名如 `yarn-1.20.1+build.10-tiny.gz.v1-upstream.gz.bak`；合计 **12,641,827 B**（机制 A = `git ls-files` 配 `upstream/` 且 `.bak` 结尾的清单再 `xargs wc -c`；机制 B = `find data/fabric_*/mappings/upstream -name '*.bak' -printf 字节数` 累加）。
- 同目录下**没有**非 `.bak` 的 `.gz`（`git ls-files` 里 `mappings/upstream/` 下以 `.gz` 结尾的件数实测 = **0**）⇒ 每一档在库的上游原件只有这一份 `.bak`。
- 它们是**上游原样 gzip**，不是派生表：`mcp-server/scripts/assert-yarn-named-integrity.mjs` 的头注与夹具把这一点钉成了设计 —— 该门第 5 条判据要求 `provenance.json` 的 `upstreamV1.sha256` **等于** `mappings/upstream/*.bak` 的实测 sha256（「provenance ↔ 磁盘双向 sha 对账」）。⇒ 保留是**有台账、有门**的，不是散落物。

**已裁定（2026-10-04）**：本族 13 件**保留在库，不降级**，不再是待裁项。依据 = 上游许可本身：FabricMC/yarn 自述「open, unencumbered Minecraft mappings, free for everyone to use under the Creative Commons Zero license」，GitHub License 标识为 **CC0-1.0**（同门 `FabricMC/intermediary` 亦为 CC0-1.0）。CC0 1.0 Universal 不对再分发设任何条件 —— 不要求署名、不要求同许可、不限制用途 —— 因此「完整且未修改」这一形态本身不产生条款冲突。

与 Mojang `client.txt` 的处置差异**不构成双标**：两者不同源、不同义务。`client.txt` 受 Mojang 专有条款约束（明文 *may not redistribute the mappings complete and unmodified*，实测 `git ls-files | grep -c client.txt` = 0 确认未入库），本族受 CC0 约束（无约束）⇒ **两者不适用同一条判据**，此前「同一句理由下两种处置」的表述不成立，已作废。

`.bak` 侧保留 `provenance.json` + sha 双向对账（`assert-yarn-named-integrity.mjs` 第 5 条）是**可审计性**措施，与许可义务无关：CC0 不要求留痕，这是本仓自选的追溯手段。

### 分发提醒（承接上文 `## Release assets` 三条）

随 `data/` zip 或 GitHub Release 再分发这四族时：保留本节与本文件；`SHA256SUMS-*` 仍用裸文件名；**不要**把 `.gitignore` 排除的 `client.txt` 顺手塞进任何包；`lib-api-summaries` 那 48 个库的条款在本仓无副本，逐库回上游查。
