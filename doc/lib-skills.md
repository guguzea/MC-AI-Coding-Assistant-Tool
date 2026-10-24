# 库模组 Skill（knowledge/libs 源稿即用）

> 本文件是根 [`AGENTS.md`](../AGENTS.md)「库模组 Skill」的**详细内容落点**。
> 根纲保留「不落盘、按组映射直读源稿、版本标记是坐标唯一真值」这几条定性与指针；
> 这里存组映射表、frontmatter 二次过滤细则、配置库禁令的完整表述与对应门。

## 库模组 Skill（knowledge/libs 源稿即用）

涉及常用库模组（配置库 / 饰品 / GeckoLib / Patchouli / CCA / Polymer 等）的 Skill **不落盘**到平台 `.cursor/skills`，一律按解析规则直接读根目录源稿：

1. 平台 → 组映射：
   - `forge` → `forge-only` + `all-platforms`
   - `fabric` / `quilt` → `fabric-only` + `all-platforms`
   - `neoforge` → `neo-only` + `all-platforms`
   - `bedrock` → `bedrock-only`（Script API 等；禁止把 CCA/Trinkets/GeckoLib 当基岩教程）
   - LiteLoader / Rift / ModLoader：暂无独立 Java 库组；不要把 Fabric/Forge 库 Skill 当这些加载器的 API
2. 在组内按名称找 `knowledge/libs/<group>/mc-<name>/SKILL.md`，**直接读源稿**，不要查平台 `.cursor/skills` 的库项（那里已清理，不存在库项）
3. 用 frontmatter 二次过滤：`platforms`（组是主依据，白名单防组内误放）、`mcVersions`（留空/未写 = 不限版本；非空则必须包含目标 MC 版本；与 knowledge/libs/README.md §3.6 及解析代码一致）
   - **版本标记是坐标唯一真值**：库 skill 若带 `versions.json`（当前：`knowledge/libs/fabric-only/mc-cloth-config/versions.json`），**写依赖坐标前必须读它对应 MC 版本的 slot**（`coord` / `state` / `basis`）；**`state != active`（`commented` / `todo`）一律不采纳**——`todo` 即 `TODO(未核实)`，**不许按邻居档推**。中心稿 SKILL.md 的「版本映射表」是证据说明，**不是取值入口**。
   - **档内手稿优先（档内工程）**：`fabric/<v>/.cursor/skills/mc-<lib>.md` 的 `<!-- cloth-version-inject v=… coord=… state=… textApi=… -->` 标记行是该档实况，由 `scripts/project-cloth-skill.mjs` 按 versions.json 回填（**禁止手改标记行**）——直接读它，不要从中心稿表格抄。
   - 这两条由 `mcp-server/test-core.mjs` §S14（注入标记 ↔ versions.json 一致性）与 §S15（`resolve-lib-skills --validate` 解析链校验）自动闸住；维护侧失步即红。
4. 不确定该用哪个库 Skill → 先读 `knowledge/libs/all-platforms/mc-lib-catalog/SKILL.md`；完整清单见 `knowledge/libs/README.md`
5. **禁止**把 Fabric 专属库（Trinkets / CCA / Polymer / Text Placeholder 等）当 Forge 教程；Forge/NeoForge 饰品用 `mc-curios`（`forge-only`），Fabric 用 `mc-trinkets`（`fabric-only`）
6. **配置不要新写树级 `mc-config` Skill**：配置**原则**一律读 `knowledge/libs/all-platforms/mc-config/SKILL.md`（工作流 `mc-config`）。**调用 `generate_config` 只限工具支持的四个平台 —— `forge` / `neoforge` / `fabric` / `quilt`**（`mcp-server/src/generators/index.ts` 的 `generateConfig(loader)` 枚举即此四者，且它没有 `platform` 参数）；**`LiteLoader` / `Rift` / `ModLoader` / `基岩` 不要调用 `generate_config`**（平台面不含它们，只有拒绝文案）——这些档的配置走各档自述 / pack JSON / Script，也不要套 Cloth / ForgeConfigSpec。
   - **选型建议与工具默认不同源不是矛盾**：`generate_config` 在 fabric / quilt 上**默认永远吐 Cloth Config 骨架**；YACL 只能作为**用户显式 opt-in** 的结果出现（`library` 参数已实现：枚举 `cloth | yacl`，**默认 `cloth`**，不传即现状；只有显式 `--library=yacl` 才换 YACL 骨架，禁止把默认改成 yacl）。
   - **第三方配置库不是 loader API（强制）**：Cloth / YACL / Fzzy / owo 等的方法名与注解，必须先由用户自备 jar 走 `ingest_loader_api` 入库（默认 dryRun，只写 `$MC_SKILL_CACHE/loader-api-summaries` overlay，禁写仓库 `data/`）并逐签名核对后才能写进骨架。**`library=yacl` 尤其如此：该用户必须另外对自己的 yacl jar 跑一次 `ingest_loader_api`，否则返回的只是带 `// TODO(未核实)` 的结构壳、编译不过。**未入库 → `query_loader_api` 只回 `found:false`，此时**只能**留 `// TODO(未核实)`，禁止凭训练记忆补方法链。
   - 本条与上面第 5 条同源：平台库 Skill 按组映射，`generate_config` 按 loader 枚举。两个面都由 `mcp-server/scripts/assert-config-platform-face.mjs` 与本条正文对齐，**单侧改动即红**（子档改了禁令而根纲没跟上、或根纲写成「一律 generate_config」，都会被抓）。
