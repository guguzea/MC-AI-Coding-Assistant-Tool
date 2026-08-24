# Community Knowledge

本目录是 **社区实务知识库**，供 MCP 工具 `search_community_docs` / `get_community_doc_*` 使用。

与 `data/` 下的官方 Forge/Fabric/NeoForge 文档库分离：查 API / 注册细节请优先用官方文档工具；本库偏发布、崩溃排查、软依赖、中文社区教程要点。

**Agent 必读规则：** [`AGENT_USAGE.md`](./AGENT_USAGE.md) — 用到本库短文时，若不清楚 / 不会，必须去访问原网站或官方文档，禁止臆造 API。

## 三类内容

| 目录 | 含义 |
|------|------|
| `permitted/` | 作者已许可可入库的社区帖（Markdown 提炼，非原始 HTML） |
| `links/` | 无全文许可：仅标题、摘要、外链 URL |
| `authored/` | 本仓库自写短文（可自由修改） |

索引：`indexes/index-l0.json`（可由 `mcp-server/scripts/build-community-index.mjs` 重建；当前约 **81** 条：authored 73 / links 4 / permitted 4）。

## `authored/` 主题速查

| 主题 | id |
|------|-----|
| 发布 | `authored/publishing` |
| 崩溃日志 | `authored/crash-reports` |
| 测试（JUnit / GameTest 选型） | `authored/testing-automation` |
| 性能 / profiler（spark、/debug tick、内存） | `authored/profiling-performance` |
| 软依赖 / CurseMaven | `authored/soft-deps-modlist`、`authored/cursemaven-optional-deps` |
| 主类 / 注册 helper / 创造页签 | `authored/mod-entry-init-structure`、`authored/register-helpers`、`authored/creative-tabs-1.20` |
| 机器 / Menu / BE / Capability | `authored/machine-be-gui-working`、`authored/menu-screen-sync`、`authored/blockentity-persist-ticker`、`authored/itemhandler-capability` |
| 模型 / 本地化 / 开发环境 | `authored/multi-face-block-models`、`authored/localization-lang`、`authored/forge-dev-env-pitfalls` |
| 自定义命令（Brigadier） | `authored/custom-commands-brigadier` |
| 矿物生成（worldgen 三层） | `authored/ore-generation-worldgen` |
| 世界数据持久化（SavedData） | `authored/saveddata-world-persistence`、`authored/fabric-saveddata-persistent-state`（Fabric 侧） |
| NeoForge 网络包（Payload，1.20.5+/26.x） | `authored/neoforge-payload-networking` |
| Forge SimpleChannel 网络（1.13–1.20.4） | `authored/forge-simplechannel-networking` |
| Fabric 网络包（Payload，1.20.5+） | `authored/fabric-networking-payloads` |
| 数据附件与持久化选型（1.20.5+） | `authored/data-attachments-vs-alternatives` |
| Fabric 命令 + 矿物生成差异 | `authored/fabric-commands-and-oregen` |
| 基岩 Script API 入门 | `authored/bedrock-script-api-primer` |
| Mixin 实务与兼容性 | `authored/mixin-practices-crossplatform` |
| 老版本 Forge 实务（1.7.10/1.12.2） | `authored/legacy-forge-1.7.10-1.12.2-practices` |
| 自定义生物全链路（实体） | `authored/custom-mob-entity-pipeline` |
| 自定义流体 | `authored/custom-fluid-neoforge` |
| 1.21+ 数据驱动附魔 | `authored/enchantments-datadriven-121` |
| 全局战利品修改器（GLM） | `authored/global-loot-modifiers` |
| 附属模组（Addon）开发工作流 | `authored/addon-dev-workflow` |
| 停更模组修补工作流（Recaf 字节码） | `authored/legacy-mod-patching` |
| Forge 事件系统实务（双总线/订阅/坑） | `authored/forge-event-system-practices` |
| Jigsaw 结构生成 | `authored/jigsaw-structure-generation` |
| 自定义维度与生物群系（TerraBlender） | `authored/custom-dimension-and-biomes` |

## `links/` 教程站索引

| 内容 | id |
|------|-----|
| Kaupenjoe 全平台课程总目录（NeoForge/Fabric/Forge × 1.16.5–26.X，MIT） | `links/kaupenjoe-courses-index` |
| Fabric Wiki / fabric 文档教程目录（Mixin 系列、发布等） | `links/fabric-wiki-tutorial-index` |
| McJty 模组指南（工程化视角） | `links/mcjty-modding-guide` |
| 基岩版官方文档与官方样例仓库 | `links/bedrock-script-api-official-samples` |
| 老加载器上游（LiteLoader/Rift/ModLoader/MCP，含存活状态） | `links/legacy-loader-upstreams` |
| MC百科开发类教程全集（Java 模组/KubeJS·CrT 脚本/数据包/加载器大全，含许可声明） | `links/mcmod-dev-tutorials` |
| 高影响力模组教程索引（Create/AE2/MEK/GT/TiC/帕秋莉等生态型大模组） | `links/major-mod-tutorial-indexes` |

## 版本路由矩阵（选篇前必查）

短文 id 省略 `authored/` 前缀。**引用任何短文前，先核对它的 `mcHint` 与工程实际版本**——规则见 [`AGENT_USAGE.md`](./AGENT_USAGE.md)「用前先对版本」。⚠️ 表示该格只有指针级覆盖，细节须回当档官方文档。

| 主题 | ≤1.12 | 1.13–1.20.4（含 1.20.1） | 1.20.5+ / 26.x | Fabric |
|------|-------|--------------------------|----------------|--------|
| 网络包 | legacy…（SimpleNetworkWrapper 指针） | `forge-simplechannel-networking` | `neoforge-payload-networking` | `fabric-networking-payloads`（1.20.5+） |
| 世界数据持久化 | — | `saveddata-world-persistence`（旧 API 半篇） | 同前（新 API）＋ `fabric-saveddata-persistent-state` | `fabric-saveddata-persistent-state` |
| 数据附加 | — | `itemhandler-capability`（Capability，物品库存侧） | `data-attachments-vs-alternatives` | ⚠️ FAPI attachment 未入库，回官方文档 |
| 附魔 | legacy…（指针） | legacy…（extends Enchantment 指针） | `enchantments-datadriven-121` | 同左（数据包层通用） |
| 流体 | — | ⚠️ `custom-fluid-neoforge` 注明 1.19.3 前无 FluidType | `custom-fluid-neoforge` | ⚠️ 篇内仅差异警告段 |
| 实体 / AI / 渲染 | legacy…（渲染器签名指针） | `custom-mob-entity-pipeline`（render() 模式） | 同左 ＋ RenderState 对照表 | 同主链路 |
| 命令 | — | `custom-commands-brigadier`（Forge 事件） | 同左 | `fabric-commands-and-oregen`（FAPI 回调） |
| 矿物 / worldgen feature | — | `ore-generation-worldgen`（biome modifier JSON） | 同左 | `fabric-commands-and-oregen`（BiomeModifications 运行时） |
| 结构（jigsaw） | — | `jigsaw-structure-generation`（1.19+ 数据包通用） | 同左 | 同左 |
| 事件系统 | `forge-event-system-practices`（经典双总线锚定 1.18–1.20.x；各版本事件名以当档规则 `05-events` 为准，四列同） | ← | ← | Fabric 侧为监听器注册制（见 fabric 系条目） |
| 附属模组开发 | — | `addon-dev-workflow`（构建记法分 FG/MDG/26.1+ 三段，全列适用） | 同左 | 思路同左；Fabric 侧互操作见 `lib-fabric-language-kotlin` 等库笔记 |
| 停更模组修补 | `legacy-mod-patching`（Recaf 字节码流，1.12 老版更常用） | 同左（第 1–3 级优先，MixinBooter 见 Mixin 行） | 同左 | 同左 |
| 维度 / 群系 | — | ⚠️ `custom-dimension-and-biomes`（26.x 核对，1.20.x 字段差异已标注） | `custom-dimension-and-biomes` | ⚠️ wiki 指针（dimensionconcepts / custom_portals） |
| Mixin | `mixin-practices-crossplatform`（全版本通用；MixinExtras 需 Loader 0.15+，三列同） | ← | ← | ← |
| 发布 / 崩溃 / 性能 / 测试 | `publishing`、`crash-reports`、`profiling-performance`、`testing-automation`（跨版本通用，四列同） | ← | ← | ← |

基岩版不在这套 Java 版本轴里：Script API 见 `authored/bedrock-script-api-primer`（stable 线，模块版本随游戏走）。老加载器（LiteLoader / Rift / ModLoader）走仓库版本档规则树，社区层只有 `authored/modloader-1.6.4`。
| 映射字段 schema v3 | `authored/mapping-fields-v3` |
| 历史加载器 | `authored/modloader-1.6.4`（1.6.4 只许用仓库 safe-api 表） |
| 代码模式库 | `patterns/`（DeferredRegister / SimpleChannel / DataComponent / cube_all / ConfigSpec） |
| 库集成（总览/索引/陷阱） | `authored/library-catalog-2026`（总览目录）、`library-integration`（分类索引）、`library-integration-jei-emi`（JEI/EMI/REI）、`lib-traps-2026`（陷阱专篇） |
| 库集成 · 配置 | `lib-cloth-config`、`lib-config-legacy`、`lib-forge-config-api-port`、`lib-fzzy-config`、`lib-midnightlib`、`lib-owo`、`lib-yacl` |
| 库集成 · 动画 | `lib-geckolib`、`lib-playeranimator`、`lib-satin` |
| 库集成 · 跨加载器 | `lib-architectury`、`lib-balm`、`lib-moonlight`、`lib-resourceful` |
| 库集成 · 饰品 | `lib-caelus`、`lib-curios`、`lib-trinkets` |
| 库集成 · 世界生成 | `lib-terrablender` |
| 库集成 · GUI | `lib-libgui`、`lib-modern-ui`、`lib-spruceui-obsidianui` |
| 库集成 · 数据附加 | `lib-cca`、`lib-player-ability-lib` |
| 库集成 · 服务端/网络/文本 | `lib-impersonate`、`lib-pehkui`、`lib-polymer`、`lib-server-translations`、`lib-text-placeholder-api` |
| 库集成 · 脚本/语言 | `lib-fabric-language-kotlin`、`lib-kotlin-for-forge`、`lib-kubejs` |
| 库集成 · 指南书 | `lib-patchouli` |
| 库集成 · 全家桶共享库 | `lib-bookshelf`、`lib-collective`、`lib-corgilib`、`lib-creativecore`、`lib-glitchcore`、`lib-iceberg`、`lib-kiwi`、`lib-libx`、`lib-libz`、`lib-malilib`、`lib-mantle`、`lib-necronomicon`、`lib-placebo`、`lib-puzzles-lib`、`lib-sophisticated-core` |

## 环境变量

- `MC_SKILL_COMMUNITY`：本目录绝对路径（优先）
- 否则：与 `MC_SKILL_DATA`（`data/`）同级的 `community_knowledge/`
