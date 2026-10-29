# 服务端面（Paper / Spigot）—— 独立面，不是模组平台的第 11 档

> 本文件是根 [`AGENTS.md`](../AGENTS.md)「服务端面（Paper / Spigot）」的**详细内容落点**。
> 根纲保留「独立面、判据走服务端日志/事件、不挂进 8 棵平台树」这条定性；
> 这里存语料两套许可、版本轴两半、签名面 id 口径、规则载体写作纪律与守护门。
> 服务端面的**执行 loop** 与客户端面 loop 合并在 [`playtest-loops.md`](./playtest-loops.md) §二。

### 服务端面（Paper / Spigot）—— **独立面，不是模组平台的第 11 档**

- **语料（正文面）**：`data/paper_stable/paper-docs/stable/`（PaperMC 官方开发文档的 `paper/dev` 面，实测 **67 页**；旁挂 `meta.json` 与 `symbols.json`，后者含 **140 个唯一 `jd:paper:` fqcn**）。产出者是 `mcp-server/scripts/fetch-paper-docs.mjs`（**默认 dry-run**，`--extract` 才落盘）。
  ⚠️ **取数路线是环境约束，别照抄别的 `fetch-*-docs`**：本机网络 `git clone https://github.com/papermc/docs` 会被 **RST**（实测 `RPC failed` / `expected 'packfile'`）⇒ 只能走 **codeload tarball** + `tar -xzf`。
- **许可（两套，必须分开看）**：上游仓库**代码** = BSD 2-Clause；**文档正文** = **CC BY-SA 4.0**（署名 + **ShareAlike**）。⇒ `data/paper_stable/**` 及其衍生文本**必须以 CC BY-SA 4.0 分发并署名 PaperMC**，**不得**与本项目 PolyForm Noncommercial 1.0.0 代码许可混写。记账在 `THIRD_PARTY_NOTICES.md`。
- **版本轴在 Javadoc，不在正文**：Paper 文档**不按 MC 版本分目录**（故落伪版本 `data/paper_stable/paper-docs/stable/`，**不套**真 MC 版本号）；版本面走 `jd.papermc.io/paper/` —— 实测 **302 → `…/paper/26.3/`**，历史档 `26.3` / `1.21.8` / `1.21.4` / `1.21.1` / `1.20.1` / `1.19.4` / `1.16.5` / `1.12.2` 首页全 **200**。
- **Spigot 侧的版本轴分两半（2026-10-24 实测）**：**javadoc 页没有**（`/javadocs/spigot/1.21.4/` 404；`/javadocs/bukkit/` 与 `/javadocs/spigot/` 是同一份当前文档）；但 **maven 构件有**（`org/spigotmc/spigot-api` 的 metadata 实测 **83 个版本**）⇒ 八个历史档从构件 `javap` 抽，不是从 javadoc 页抓。
- **签名面（两个**独立平台 id**：`spigot` 与 `paper-api`）**：`data/spigot_stable/spigot-javadoc/stable/`（**1396 类**）与 `data/paper-api_stable/paper-javadoc/stable/`（**2116 类**，含 `io.papermc.paper.*` 这类 Paper 专有类）。**为什么签名面各占一个平台 id**：`FabricDocStore` 是**单源**（只读一个 `source` 子目录），同平台第二棵树不会进检索；而目录前缀取 `paper-api` 能让 `versionDataDir` / `hasPrefixedIndex` / `resolvePlatformDataDir` 三处的 `${platform}_` 拼法**全自动对上** ⇒ **零特例分支**。产出者 `mcp-server/scripts/fetch-spigot-javadoc.mjs`（**默认 dry-run**；`type-search-index.js` 驱动机读类清单 + `member-signature` 抽签名；**分块续抓** `--offset/--limit`、**批并发** `--concurrency` 默认 8 —— 实测并发 15×：1.03 秒/类 → 0.07 秒/类）。
  - **版本口径（2026-10-24 更新：版本档已存在）**：**javadoc 面**仍是伪版本 `stable`（上游 URL 无版本轴，`/spigot/1.21.4/` 实测 404），真实版本串留在每页 `asOfVersion`（Spigot `26.3-R0.1-SNAPSHOT` / Paper `26.3.build.178-stable`，取自 `index.html` 的 `<title>`；取数器**双向对钉**，不一致即拒）。复跑现役布局：`--version <上游真实串> --pseudo-version stable --out data/<face>_stable/<face>-javadoc/stable`（两个版本位 2026-10-15 拆开：`--version` 只管双向钉、`--pseudo-version` 只管档目录名与 `id` 前缀；后者缺省 = `--version`，但带后缀的真实串不在 store 白名单内 ⇒ 抓这两个面时**必须**显式给 `--pseudo-version stable`）。
    **历史档**两套，别混：
    | 平台 | 历史档落点 | 取数路线 | 档数 |
    |---|---|---|---|
    | `paper-api` | `data/paper-api_<ver>/paper-javadoc/<ver>/` | javadoc 页（`jd.papermc.io/paper/<ver>/`）→ `fetch-spigot-javadoc.mjs` | 5（1.21.4/1.21.1/1.20.1/1.16.5/1.12.2） |
    | `spigot` | `data/spigot_<ver>/spigot-javadoc/<ver>/` | **构件的 javap** → `extract-spigot-api-surface.mjs` | 8（1.21.8/1.21.4/1.21.1/1.20.6/1.20.1/1.19.4/1.16.5/1.12.2） |
    Spigot 历史档的目录名虽然叫 `spigot-javadoc`（`PLATFORM_DOC_SUBDIR.spigot` 的约定），**来源是构件不是 javadoc HTML**：每页 `sourceType: javap` + `jarMd5`，`meta.json` 有 `faceKind: signature-face-from-artifact`。
  - **id 口径（扁平唯一名，实测）**：`id` = `stable/` + 「包路径把 `.` 换成 `_`」+ `_` + `<Class>`；`processed` 相对路径 = 同 `id` 去掉 `stable/` 前缀 + `.md`（嵌套类保留 `.`）。例：`stable/org_bukkit_event_player_PlayerFishEvent.State` → `processed/org_bukkit_event_player_PlayerFishEvent.State.md`。**包路径一律不拍回嵌套目录**：Java 里同包名同类（如三个 `Bed`）会撞 `assert-corpus-faithfulness` 的 A2 判据（2026-10-14 实测 ⇒ 改布局而非放松判据，见 `mcp-server/scripts/assert-corpus-faithfulness.mjs:116-117`）；而 `processedFileFor` 只剥版本前缀（`mcp-server/src/docs-platform/fabric/store.ts:307`）⇒ 换个字面量就**静默读空**。（教程面 `paper-docs` 的正文名另用 `__` 连接，见 `mcp-server/scripts/fetch-paper-docs.mjs` 的 `bare` 口径，两个 face 不要互相套。）
  - **许可**：`SpigotMC/Spigot-API` = **GPL-3.0** 且 **2021-12-28 已归档** ⇒ **不抄源码**，只把 API 名字/签名（事实面）当检索对象。**SpigotMC Wiki 实测无任何开放许可**（仅 `© SpigotMC Pty. Ltd.`）⇒ **一律不入 `data/`**，只能走 `community_knowledge/links/`（仅标题/摘要/外链）—— 这就是 **Spigot 面无教程正文、只有签名面**的原因。
  - ⚠️ **`paper-api` 与 `paper` 不是同一许可**：`data/paper-api_stable/paper-javadoc/`（签名面）随上游 Paper/Spigot 条款；`data/paper_stable/paper-docs/`（教程面）是 **CC BY-SA 4.0**。2026-10-14 起两棵树分属不同平台 id 与**不同目录**，不要按"同目录子树"理解。
  - ⚠️ **Spigot 历史档是 GPL-3.0 构件的派生（2026-10-24 登记）**：`data/spigot_<ver>/` 的签名逐字来自 **GPL-3.0 的 `spigot-api` 构件**的 `javap`。入库的只有「类名 / 成员签名 / 枚举常量名」这类事实；**构件本身落 `temp/spigot-jars/`（gitignored）**，方法体 / 注释散文 / 初始化值一律没抽。签名集合与"GPL 传染性是否延及接口清单"**都没有定论** ⇒ 按**最小化派生**处理、**不构成再分发授权**，也不改变上游状态；权利人要求即删该子树与生成器。详见 `THIRD_PARTY_NOTICES.md` 的「派生的签名面」条。
- **禁止用模组平台的形式装它**：载体是 `runServer`（不是 `runClient`）、API 是 Bukkit 抽象层（插件代码不碰 `net.minecraft.*`）、生命周期是 `plugin.yml` + `onEnable`（不是 `@Mod` + 事件总线）；逐档 javap 改写表在插件侧**零适用**。⇒ 要支持就**单开一条服务端面**（判据走服务端日志/事件），不得挂进现有 8 棵平台树。

**规则载体（服务端面**自己**的形状，**不是**上面「第二步」那套 `.cursor/rules/00–10.mdc`）**：

- **位置与扩展名**：`paper/<ver>/rules/<NN>-<topic>.md`（**不带** `.cursor/`、**用 `.md` 不是 `.mdc`**）+ 同档 `paper/<ver>/rules.meta.json`。
  **为什么不套模组形状**：模组那套 `00–10` 的条款集（Mixin / 注册表 / 客户端事件 / 数据生成）对插件**大半不适用**，硬套会造出一棵假档 —— 与「别为填一个版本号克隆树」同一类错误。本面只写**服务端有的**（事件 / 命令 / 物品栏 / 权限 / 调度器 / `plugin.yml` / 配置 / PDC / Adventure / 实测陷阱）。
- **不走 `activate_platform_pack session`**：那是模组知识包加载器；本面用 `search_docs platform=paper|paper-api|spigot` + 本目录的规则文件。
- **写作纪律（可机械检）**：
  1. 每条 API 论断必须带**出处指针** `<语料文件名>.md:<行号>`（可写短名，按**后缀**解析到三个语料面之一），且**行号在界内、不是空行**；
  2. 语料证不出的（含所有"通识性"道理）**必须写进「未核实」段**，不许写成结论 —— 两个签名面的 processed 页**只有签名、没有描述散文**，所以"该怎么用"这类话**没有出处就是编造**；
  3. **不复述教程原文**（`data/paper_stable/paper-docs/` 是 **CC BY-SA 4.0**，复述会把 ShareAlike 义务引到本树）；只写结论 + 指针。
- **守护门**：`mcp-server/scripts/assert-server-rules-integrity.mjs`（挂 `test-scripts.mjs` 的 `REAL_RUN_GATES`；带投毒自证 **6/6**：①引到不存在的文件 ②行号越界 ③指向空行 ④完全无「未核实」 ⑤**只在行文里提该词（无标题）** ⑥**有标题但空段**）。⚠ 别指望 `assert-rules-api-names.mjs`（只收 `.mdc`）或 `assert-rules-match-tool.mjs`（quilt 专属）代管本面 —— 二者实测**扫不到**这里。
- ⚠ **「未核实」的判据是"真标题 + 至少一条"**，不是"文中出现过该词"（首版就是这么弱的判据，2026-10-15 改）。写这一面时别只提一句就当交代了。
