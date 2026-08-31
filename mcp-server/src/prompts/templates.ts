import { ownGet } from "../utils/own-record.js";
import { generateNetworkPacketDescription } from "../generators/index.js";

/** 人在环：工作流是步骤清单，不是无人值守编排器。 */
export const WORKFLOW_HITL =
  "【人在环】模组开发不是确定性流水线。创意设计、版本兼容取舍、API 选择、性能权衡、调试策略由用户决定。写盘、运行 Gradle、拷贝 jar、上传发布须用户确认后执行；Agent 给步骤与草稿，不代跑这些高风险操作。";

/** LiteLoader / Rift / ModLoader / 基岩：禁止把现代 Forge/Fabric API 当骨架。 */
export const WORKFLOW_ERA_GUARD =
  "N-A / era：LiteLoader / Rift / ModLoader 只用该档核实表，禁止 DeferredRegister、Forge biome_modifier、ForgeConfigSpec、Cloth Config、现代 GameTest、generate_datagen。基岩走 Script/JSON，不是 Java Mixin/GameTest。核不到则 stub + search_docs，禁止编造邻档类名。";

export const WORKFLOW_TEMPLATES: Record<string, { title: string; body: string }> = {
  "mc-new-block": {
    title: "新方块工作流",
    body: `1. 确认平台与精确 MC 版本。从零工程：download_official_mdk（dryRun 先看；26.1.x/26.2 须选 buildPlugin）。已有工程不要下 MDK。
2. 先 activate_platform_pack action=session（可 task=mc-new-block），用返回的 rules / skillBodies；禁止 Read 平台/<ver>/.cursor。不要默认 Forge 1.20：
   - Forge：DeferredRegister（该版规则）
   - NeoForge：该档 DeferredRegister / DeferredBlock / DeferredHolder；禁止 RegistryObject 冒充 1.20.4+ Neo；禁止 NeoForgeAddonPlugin
   - Fabric：Registry.register；26.1.2 用官方名 + implementation，不要 modImplementation
   - Quilt：Vanilla Registry.register + ModInitializer(ModContainer)；禁止编 QuiltRegistry；02–10 仍读 fabric/<ver>
   - LiteLoader / Rift / ModLoader：只使用该版核实表；禁止 DeferredRegister / generate_datagen
3. 注册 BlockItem（现代档）或该时代等价物
4. 资源：现代档 generate_model（须传 version）或 DataGen；老平台手写 assets/ JSON
5. lang：generate_lang（须传 version；en_us/zh_cn）
6. 战利品/合成：Forge 1.20.1 与 NeoForge 1.21.x 才 generate_datagen；其余手写 data/ 或 ModLoader.addRecipe`,
  },
  "mc-new-entity": {
    title: "新实体工作流",
    body: `1. 确认平台与精确 MC 版本（从零才 download_official_mdk；已有工程不要下）
2. 先 activate_platform_pack action=session（可 task=mc-new-entity），用返回的 rules / skillBodies；禁止 Read 平台/<ver>/.cursor：
   - Forge/NeoForge：EntityType + 该档注册 API（Neo 用 DeferredHolder 族，禁止把 Forge RegistryObject 当 Neo）
   - Fabric/Quilt：Registry.register EntityType；基岩用 BP/RP JSON，不是 EntityType
   - 老平台：核实表里的 Adder / BaseMod 钩子；表外禁止输出
3. 客户端渲染：现代档 generate_entity_renderer / 04；Rift 用 EntityRendererAdder
4. loot / 音效按该时代资源路径，不要对 LiteLoader/Rift/ModLoader 调 generate_datagen`,
  },
  "mc-new-gui": {
    title: "GUI 工作流",
    body: `1. 确认平台与 MC 版本（已有工程不要下 MDK）
2. 先 activate_platform_pack action=session（可 task=mc-new-gui），用返回的 rules / skillBodies；禁止 Read 平台/<ver>/.cursor。按平台分支，不要默认 MenuType：
   - 现代 NeoForge / Forge：MenuType + AbstractContainerMenu；Screen 注册按该档 10-gui / mc-gui（勿写死 MenuScreens.register）
   - Fabric / Quilt：该版 10-gui（Quilt 02–10 仍读 fabric/<ver>）
   - LiteLoader：GuiScreen / HUDRenderListener（核实表）；禁止 MenuType
   - Rift：GameGuiAdder / OverlayRenderer（核实表）
   - ModLoader：核实表 Gui；禁止 DeferredRegister
   - 基岩：BP/RP JSON，不要 MenuType
3. 同步：NeoForge 1.20.1 同 Forge 形态（SimpleChannel）；1.20.4 为 RegisterPayloadHandlerEvent（单数）；1.21.1–1.21.5 为 RegisterPayloadHandlersEvent + DirectionalPayloadHandler；1.21.8/1.21.11/26.1 为 RegisterClientPayloadHandlersEvent + ClientPacketDistributor.sendToServer（26.1/1.21.11 用 Identifier）。禁止把 1.20.4+ Payload 写进 Neo 1.20.1。`,
  },
  "mc-crash-triage": {
    title: "崩溃分诊",
    body: `1. analyze_log / crash_analyze；可选 inspect_runtime（优先 logsDir，禁止全盘）
2. search_community_docs 按 crashKind
3. 先看 status / skipped，再看 action，不要只看 passed。
   STATUS_GATE: skipped → docs（LiteLoader/Rift/ModLoader/基岩）
   STATUS_GATE: passed → continue
   STATUS_GATE: failed → 按 errors 修
   - Forge / Fabric / Quilt / NeoForge：validate_project 与 diagnose_gradle 已做真检查；看 status
   - 仍 skipped 的 loader 换 search_*_docs / validate_addon_manifest
4. mixin_analyze；diagnose_gradle 若构建失败（同样先看 status/skipped）
5. 性能 / 卡顿类：先读 community authored/profiling-performance（spark、/debug tick、内存诊断），再改代码前先测量`,
  },
  "mc-port-mod": {
    title: "移植模组",
    body: `1. analyze_porting_path
2. 与用户确认 targetPlatform / targetVersion
3. port_project dryRun=true 逐步执行
4. get_migration_guide 查路线摘要`,
  },
  "mc-build-mod": {
    title: "模组构建流程",
    body: `${WORKFLOW_HITL}
1. 确认平台 / 精确 MC 版本 / mappings。从零工程：调用 download_official_mdk（dryRun 先看 URL/hash；26.1.x/26.2 须选 ModDevGradle 或 NeoGradle，二者官方都提供）。已有工程加内容不要下 MDK。
2. 读 MDK 返回的 buildPlugin / mappings / entryClass，再 activate_platform_pack action=session（需要全套规则才 includeAllRules=true）；未建档版本禁止读邻档规则，改口 search_*_docs。禁止 Read 平台/<ver>/.cursor。
3. validate_project（Forge/Fabric/Quilt/NeoForge 真检查，看 status）；LiteLoader/Rift/基岩 skipped。必要时 diagnose_gradle / check_dependencies
4. 构建（用户确认后执行，Agent 不代跑）：Forge/NeoForge 用 ./gradlew build；Fabric 用 Loom 等价任务；需要资源时先跑 DataGen
5. 确认产出 jar：build/libs/（排除 -sources、-javadoc 等）
6. 构建失败：对 Gradle/编译日志用 analyze_log / crash_analyze，修好后重跑构建
7. 卡顿 / 性能问题：读 community authored/profiling-performance（先测量后优化），不是直接改代码
8. 完成后可接工作流 mc-ingame-iterate（真机测试与修复循环）`,
  },
  "mc-ingame-iterate": {
    title: "真机测试与修复循环",
    body: `${WORKFLOW_HITL}
【前置】未向用户索取路径前禁止臆造盘符。本波只指导复制/核对路径；拷 jar 到游戏目录必须用户确认后执行，禁止 Agent 无人值守写盘。

1. 向用户索取并确认：
   - launcher: official | HMCL | PCL2 | other
   - minecraftRoot（游戏根）与 versionName（版本/实例名）
   - isolated: true|false（装模组场景默认按 true，仍须用户确认）
2. 解析目录（列出绝对路径，请用户用启动器「打开游戏/版本文件夹」核对后再继续）：
   - isolated=true  → instanceRoot = <minecraftRoot>/versions/<versionName>
     modsDir / logsDir / crashReportsDir = instanceRoot 下同名子目录
   - isolated=false → 上述目录落在 <minecraftRoot> 全局 mods/logs/crash-reports
   - other：只接受用户直给的 modsDir + logsDir

【启动器约定】
- HMCL：设置 → 全局游戏设置 → 版本隔离 →「各实例独立」。
  隔离后结构见 https://docs.hmcl.net/launcher/isolation.html
  modsDir = <minecraftRoot>/versions/<versionName>/mods
  说明：https://docs.hmcl.net/launcher/set-item-details.html
  装模组前建议开隔离：https://docs.hmcl.net/launcher/auto-installing.html
  可用「快速打开各个游戏文件夹」核对；索引 https://docs.hmcl.net/
- PCL2：许多安装把 PCL 可执行文件放在 .minecraft 根内，此时「PCL 目录」=「游戏根」，不要再嵌套一层 .minecraft。
  实机参考：D:\\Minecraft\\.minecraft（PCL 所在）→ versions\\<versionName>\\mods
  仓库/帮助：https://github.com/Meloong-Git/PCL 、https://github.com/Meloong-Git/PCLHelp
  自定义版本目录时以 PCL「打开版本文件夹」显示为准。
- 官方启动器：默认 %AppData%\\.minecraft；独立游戏目录时同样多为 versions/<versionId>/mods。

3. 用户确认路径后，将最新构建 jar 放入 modsDir（可选备份旧同名 jar）；提醒关闭正在运行的游戏。Agent 列出要拷的文件与目标路径，不擅自写入游戏目录
4. 用同一启动器启动该隔离实例；复现问题
5. 读取该实例 logs/latest.log 与 crash-reports/ → analyze_log / crash_analyze；可配合 search_community_docs、mixin_analyze
6. 修代码 → 走 mc-build-mod 再构建 → 换 jar 再测（循环直到通过）
7. 可选兼容性测试：同实例或第二实例；基线（目标 mod + 硬依赖）→ 逐步加入其它 mod；记录冲突与加载顺序
   （HMCL 切换版本场景可参考「隐藏启动器并在游戏结束后重新打开」）`,
  },
  "mc-localize-mod": {
    title: "模组汉化工作流",
    body: `【原则】不调用外网机翻 API；localize_mod 只做 diff/草稿/抽 jar；中文由 Agent 填写。默认不写游戏目录。
社区短文：authored/localization-lang；新建骨架可用 generate_lang（须传 version）。

1. 判定模式：
   - own：自有工程 assets/<modid>/lang/
   - third_party：用户提供本地模组 jar 绝对路径
2. own：
   - localize_mod mode=own action=diff（对比源与 zh_cn）
   - 根据 keyRenameHint 人工判断 extraInZh / missingInZh 是否键重命名
   - action=draft_zh → 保留已有中文，缺键用源文占位 + needsTranslation
   - Agent 翻译 needsTranslation → 写回工程 zh_cn.json
3. third_party：
   - extract：查看 availableNamespaces / availableLocales / sourceLocaleUsed
   - 多 ns 时必须显式 namespace（勿猜测）
   - 若 sourceLocaleFallback=true：告知用户源不是 en_us，请对照语境
   - 若 code=Chinese_ready_in：仅有中文，无法检测缺键；是否改写由用户决定
   - pack_draft（可带 mcVersion）→ 复述 packFormatNeedsReview / pack_format 与源语言回退
   - Agent 译 needsTranslation → 用户手动放入 resourcepacks/
4. 自检：游戏内切简体中文；占位符 %s/%d；是否仍显示原始 key
5. 可选：无 lang 骨架时先 generate_lang（须传 version）`,
  },
  "mc-decompile-mod": {
    title: "模组反编译研究（定位真实实现 → 修改建议）",
    body: `【前置】反编译是显式用户动作：默认零下载、仅写 $MC_SKILL_CACHE（不写项目目录）。
先确认用户意图：查签名 → query_api / get_method_params（勿触发下载）；要完整源码 → 本工作流。
Java 前置：本机需 Java 17+（Temurin/Adoptium https://adoptium.net/temurin/releases/?version=17）；缺失时工具会返回 TOOLCHAIN_MISSING 指引。

1. 定位 jar：请用户给出本地 mod jar 绝对路径（或 MC 版本号，用于 get_minecraft_source）
2. 摸清元数据：analyze_mod_jar { jarPath } → modId / loaders / entrypoints / mixins / 依赖
3. 反编译：decompile_mod_jar { jarPath, version?, mapping? } → $MC_SKILL_CACHE/decompiled-mods/<modId>/<version>/ 源码树摘要
   - 或查 MC 原生源码：get_minecraft_source { version, className, mapping:"auto" }
4. 检索目标：search_mod_code { jarPath | decompiledDir, query } 定位目标类/方法/字段（可正则）
5. 读源码 → 定位真实实现 → 给出修改建议（涉及 API 用法用 query_api 核对签名）
6. 衔接：进入 mc-build-mod（构建验证）→ mc-ingame-iterate（真机测试循环）；移植场景先走 mc-port-mod
7. 提示用户：首次反编译 3–10 分钟，二次缓存命中 <1s；MC_SKILL_SKIP_DOWNLOAD=1 时下载类工具会诚实失败`,
  },
  "mc-new-item": {
    title: "新物品工作流",
    body: `1. 确认平台与精确 MC 版本。已有工程不要 download_official_mdk。
2. 先 activate_platform_pack action=session（可 task=mc-new-item），用返回的 rules / skillBodies；禁止 Read 平台/<ver>/.cursor。不要默认 Forge 1.20 Item：
   - Forge：DeferredRegister ITEMS（该版规则）
   - NeoForge：该档 DeferredItem / DeferredHolder；禁止 RegistryObject 冒充 1.20.4+ Neo
   - Fabric：Registry.register；26.1.2 用官方名 + implementation
   - Quilt：Vanilla Registry + ModInitializer(ModContainer)；02–10 读 fabric/<ver>
   - 老平台：核实表；禁止 DeferredRegister
3. 创造栏 / 食物 / 工具属性按该档 03，不要抄邻版
4. 模型：generate_model（须传 version）或 DataGen；lang：generate_lang（须传 version）
5. 合成：generate_datagen 仅 Forge 1.20.1 与 NeoForge 1.21.x / 已提供的 26.1 模板；其余手写 data/`,
  },
  "mc-new-blockentity": {
    title: "方块实体工作流",
    body: `1. 确认平台与精确 MC 版本
2. 先 activate_platform_pack action=session（可 task=mc-new-blockentity），用返回的 rules / skillBodies；禁止 Read 平台/<ver>/.cursor：
   - Forge/NeoForge：BlockEntityType + 该档注册（Neo 用 DeferredHolder 族）
   - Fabric/Quilt：BlockEntityType.Builder + Registry.register
   - 老平台：核实表 TileEntity；表外禁止输出
3. 先有方块再挂 BE；校验顺序不要反
4. 客户端渲染按该档 08；同步用该档网络 API（Neo 禁止 SimpleChannel）
5. GUI 若需要再接 mc-new-gui`,
  },
  "mc-mixin": {
    title: "Mixin 工作流",
    body: `${WORKFLOW_ERA_GUARD}
1. 确认平台与 MC 版本；先 mixin_analyze（静态）。deep:true 需已缓存 remapped 客户端 jar，未缓存会 CACHE_MISS，不要自动下载。LiteLoader/Rift/ModLoader 若核实表无 Mixin，停止，不要吐 @Inject 现代骨架。
2. mixins.json：common 进 mixins[]，client/server 分桶，不要把 common 写进 client。
3. 注入点用该档 mappings（Yarn named / Mojmap / MCP）；禁止 class_ / method_ 中间名当 API。
4. 高风险 @Overwrite / MixinExtras 先 warning；改字节码目标用 validate_at / validate_aw。
5. 跑 mixin_analyze 看 TARGET_METHOD_MISSING；再构建验证。`,
  },
  "mc-worldgen": {
    title: "世界生成工作流",
    body: `${WORKFLOW_ERA_GUARD}
1. 确认平台与精确 MC 版本。先 activate_platform_pack action=session（可 task=mc-worldgen），用返回的 rules / skillBodies；禁止 Read 平台/<ver>/.cursor。禁止默认 Forge biome_modifier。LiteLoader/Rift/ModLoader 无 biome_modifier / placed_feature 时代 API 时改口核实表，不要吐 1.18+ JSON 骨架冒充已核。
2. 配置：configured_feature / placed_feature JSON 或该档 Datagen。
3. 注入生物群系：
   - Forge 1.20.1：forge:add_features biome_modifier
   - NeoForge：该档 biome modifier / datagen（26.1 以 Identifier 为准）
   - Fabric/Quilt：BiomeModifications 或该版文档；核不到则 search_fabric_docs
4. generate_worldgen 须同时传 platform 与 version（fabric/quilt 不出 forge/biome_modifier）。类名必须能在本版文档核到。`,
  },
  "mc-config": {
    title: "配置工作流",
    body: `${WORKFLOW_ERA_GUARD}
1. 确认平台与版本。generate_config 的 loader 与 version 必填。树级不要新写 mc-config Skill：读 knowledge/libs/all-platforms/mc-config/SKILL.md。
2. 分支：
   - Forge：ForgeConfigSpec
   - NeoForge 1.20.1：ForgeConfigSpec（forgeCompatible）；1.20.4 / 1.20.6 / 1.21+ / 26.1：ModConfigSpec（禁止把 1.20.4 写成 ForgeConfigSpec）
   - Fabric/Quilt：Cloth Config（mc-config Skill）；不要生成 ForgeConfigSpec
   - LiteLoader / Rift / ModLoader / 基岩：不要生成 ForgeConfigSpec / Cloth / YACL
3. 注册到 ModConfig / Cloth 屏幕按该档；缺依赖要在 fabric.mod.json / mods.toml 声明。`,
  },
  "mc-gametest": {
    title: "GameTest 工作流",
    body: `${WORKFLOW_ERA_GUARD}
1. 确认平台与 MC 版本。GameTest 不是所有加载器都有同一套 API。LiteLoader / Rift / ModLoader / 基岩无现代 GameTest：停止，不要吐 @GameTest / generate_datagen 测试骨架。
2. Forge/NeoForge：先 activate_platform_pack action=session（可 task=mc-gametest），用返回的 rules / skillBodies；禁止 Read 平台/<ver>/.cursor。再用 search_*_docs 核类名，禁止默记 1.20.1。
3. Fabric：Fabric GameTest / 该版 wiki；核不到则 stub，不要编 Forge GameTest。
4. 结构文件放 data/<modid>/gametest 或该版路径；用户确认后跑 ./gradlew 对应 test 任务，不要假设 runGameTestServer 通用，也不要无人值守代跑。`,
  },
  "mc-publish": {
    title: "发布清单（人在环：不代上传）",
    body: `对照 community_knowledge/authored/publishing.md。禁止调用 CurseForge / Modrinth 上传 API。
1. 元数据（按平台）：Java 版 mods.toml / neoforge.mods.toml / fabric.mod.json / quilt.mod.json；LiteLoader litemod.json；Rift riftmod.json；基岩 manifest.json——核对 id、version、license
2. 产物：build/libs 正式 jar（排除 -sources、-javadoc、dev）
3. changelog 与支持的 MC/loader 版本
4. 可选 check_publish_ready（若已注册）做机器检查；默认不写盘、不调外网
5. 用户自行上传（人在环，Agent 不调 Curse/Modrinth 上传 API）。`,
  },
  "mc-networking": {
    title: "网络通信清单",
    body: `清单（人在环：Agent 出步骤与草稿；Gradle / 写盘 / 上传须用户确认后执行）。对应 Skill：mc-networking；规则 06-networking。
1. 确认平台与精确 MC 版本。改已有代码不要调本工作流。
2. 先 activate_platform_pack action=session（可 task=mc-networking），用返回的 rules / skillBodies；禁止 Read 平台/<ver>/.cursor。NeoForge 1.20.1 同 Forge SimpleChannel 形态；1.20.4 为 RegisterPayloadHandlerEvent（单数）；1.21.1–1.21.5 为 RegisterPayloadHandlersEvent + DirectionalPayloadHandler；1.21.8/1.21.11/26.1 为 RegisterClientPayloadHandlersEvent + ClientPacketDistributor.sendToServer。
3. generate_network_packet：${generateNetworkPacketDescription()}
4. 类名核 search_*_docs（本档版本）。无模板则手动编写，不要理解为游戏里做不了。`,
  },
  "mc-capability": {
    title: "能力 / 附件清单",
    body: `清单（人在环：Agent 出步骤与草稿；Gradle / 写盘 / 上传须用户确认后执行）。对应 Skill：mc-capability。
1. 确认平台与精确 MC 版本。
2. Forge：Capability + AttachCapabilitiesEvent。NeoForge 1.20.1 同 Forge Capability 形态；1.20.4+：Data Attachment，不是 Forge Capability。Fabric/Quilt：CCA（mc-cca），禁止生成 Forge Capability。
3. generate_capability 的 platform 与 version 必填。
4. 核 search_*_docs；无模板改口规则 05 / mc-capability，不要默写邻档类名。`,
  },
  "mc-recipe-data": {
    title: "配方 / 掉落 / 进度数据包清单",
    body: `清单（人在环：Agent 出步骤与草稿；Gradle / 写盘 / 上传须用户确认后执行）。对应 Skill：mc-recipe / mc-loottable / mc-advancement；规则 07-datagen。
1. 确认平台与精确 MC 版本。
2. 配方/战利品/进度 JSON 路径按该档 data/<modid>/。
3. generate_datagen 仅白名单版本（Forge 1.20.1 / 1.20.4 FinishedRecipe；NeoForge 1.20.1 改口 search_neoforge_docs，禁止默写 Forge import；NeoForge 1.20.4 / 1.20.6 仅 recipe——1.20.4 一参 PackOutput+RecipeOutput，1.20.6 两参 PackOutput+HolderLookup；1.21.0–1.21.4 为 GatherDataEvent+addProvider，1.21.5+ 为 GatherDataEvent.Client+createProvider，1.21.11/26.1 用 Identifier；Fabric 1.21.1/1.21.3/1.21.4/1.21.8 为 generate()，1.21.10/1.21.11 为 buildRecipes，26.1 Loom；Quilt 无足够 QSL 类名则 error）。其它版本 search_*_docs + 手写，参考 07-datagen / mc-datagen。
4. validate_datapack_json 须传 version；minecraft:crafting_special_* 无 result 不报错。`,
  },
  "mc-audio-vfx": {
    title: "音效 / 粒子清单",
    body: `清单（人在环：Agent 出步骤与草稿；Gradle / 写盘 / 上传须用户确认后执行）。对应 Skill：mc-sound / mc-particle。
1. 确认平台与精确 MC 版本。
2. sounds.json 与粒子 JSON 按该档 assets 路径；先 activate_platform_pack action=session 取规则后再写注册 API，禁止 Read 平台/<ver>/.cursor，禁止抄邻档。
3. 无生成器模板时 search_*_docs 手动编写，参考 mc-sound / mc-particle。不要理解为游戏里做不了。`,
  },
  "mc-commands": {
    title: "命令清单",
    body: `清单（人在环：Agent 出步骤与草稿；Gradle / 写盘 / 上传须用户确认后执行）。对应 Skill：mc-command。
1. 确认平台与精确 MC 版本。
2. 先 activate_platform_pack action=session（可 skillNames=["mc-command"]），用返回的 rules / skillBodies；禁止 Read 平台/<ver>/.cursor。Brigadier / Commands / 权限来源以本版文档为准。
3. 类名核 search_*_docs。LiteLoader/Rift/ModLoader 只用核实表，禁止 DeferredRegister。`,
  },
  "mc-dimension-structure": {
    title: "维度 / 结构清单",
    body: `清单（人在环：Agent 出步骤与草稿；Gradle / 写盘 / 上传须用户确认后执行）。对应 Skill：mc-dimension / mc-structure。
1. 确认平台与精确 MC 版本。先 activate_platform_pack action=session（可 task=mc-worldgen），用返回的 rules / skillBodies；禁止 Read 平台/<ver>/.cursor。
2. 结构：template pool / structure set 按该档 07；不要默认 Forge biome_modifier。
3. generate_worldgen 须传 platform 与 version。类名核 search_*_docs。`,
  },
  "mc-access": {
    title: "AT / AW 访问变换清单",
    body: `清单（人在环：Agent 出步骤与草稿；Gradle / 写盘 / 上传须用户确认后执行）。无独立 Skill；工具：validate_at / validate_aw。
1. 确认平台：Forge/NeoForge 用 Access Transformer（*_at.cfg）；Fabric/Quilt 用 Access Widener。
2. validate_at / validate_aw：可传 projectPath 扫描；deep 字节码校验需已缓存客户端 jar。
3. 未缓存返回 CACHE_MISS，不要自动下载。mixin 改目标可衔接 mixin_analyze。`,
  },
  "mc-bedrock-addon": {
    title: "基岩 Add-On 清单",
    body: `清单（人在环：不代跑 Gradle / 不代跑流水线）。对应 bedrock 的 mc-addon-* Skill。禁止 Java query_api / Yarn / Mixin。
1. 包根 manifest.json（format_version + modules）。validate_addon_manifest。
2. BP：行为实体/战利品等 JSON。generate_bp_entity 只吐文本。validate_bp_json。
3. RP：纹理/模型/语言。不要抄 Java assets 路径当基岩 RP。
4. script 模块（若有）：对照 search_bedrock_docs，不要 Fabric ModInitializer。
5. 再 validate_addon_manifest + validate_bp_json。不要 activate Java 平台包或 diagnose_gradle。`,
  },
  "mc-fluid": {
    title: "流体工作流",
    body: `清单（人在环：Agent 出步骤与草稿；Gradle / 写盘 / 上传须用户确认后执行）。
1. activate_platform_pack action=session（可 topics 02）。读本档 mc-fluid / 核实表。
2. 类名必须 search_*_docs 且 version 写死本档。禁止默写 FluidType 邻档签名。
3. 资源：fluid 贴图/still-flow JSON 按该时代路径。不要对 LiteLoader/Rift/ModLoader 调 generate_datagen。`,
  },
  "mc-enchant-potion": {
    title: "附魔与药水清单",
    body: `清单（人在环：Agent 出步骤与草稿；Gradle / 写盘 / 上传须用户确认后执行）。
1. session 读 mc-enchantment / mc-potion / mc-effect。
2. 注册与酿造以该档核实表 + search_*_docs 为准，禁止默写。
3. 语言键 generate_lang（须 version）。`,
  },
  "mc-energy": {
    title: "能量系统清单",
    body: `清单（人在环：Agent 出步骤与草稿；Gradle / 写盘 / 上传须用户确认后执行）。
1. session 读 mc-energy / mc-capability。Neo 用 Data Attachment，不是 Forge Capability。
2. Fabric/Quilt 改口 CCA 或该档附件 API。禁止把 IFE 抄错加载器。
3. 核不到则 search_*_docs，禁止默写 IEnergyStorage。`,
  },
  "mc-creative-tags": {
    title: "创造标签 / Item Group 清单",
    body: `清单（人在环：Agent 出步骤与草稿；Gradle / 写盘 / 上传须用户确认后执行）。
1. 确认平台：Neo/Forge CreativeModeTab 或该档等价；Fabric ItemGroup；Quilt 可能走 QFAPI（以 qsl-verified 为准）。
2. search_*_docs version 写死本档。禁止把 Fabric ItemGroup 写进 Forge。
3. 数据包 tags 用 validate_datapack_json kind=tag。`,
  },
  "mc-kotlin": {
    title: "Kotlin 模组清单",
    body: `清单（人在环：Agent 出步骤与草稿；Gradle / 写盘 / 上传须用户确认后执行）。
1. Forge/Neo：Kotlin for Forge（库 Skill mc-kotlin-for-forge）。Fabric/Quilt：fabric-language-kotlin（库 Skill mc-fabric-language-kotlin）。
2. 不要混用 gradle.kts 记忆与 Java 入口。session 仍用本档 Java 规则 + 库 Skill。
3. 只出依赖与入口清单；Gradle 由用户确认后执行。`,
  },
  "mc-villager": {
    title: "村民职业 / 交易清单",
    body: `清单（人在环：Agent 出步骤与草稿；Gradle / 写盘 / 上传须用户确认后执行）。对应 Skill：mc-villager；规则 04-entity。
1. 确认平台与精确 MC 版本。改已有代码不要调本工作流。
2. 先 activate_platform_pack action=session（task=mc-villager），用返回的 rules / skillBodies；禁止 Read 平台/<ver>/.cursor。
3. 职业/交易 API 以本档 search_*_docs + Skill 为准，禁止抄邻档 VillagerProfession 签名。`,
  },
  "mc-multiblock": {
    title: "多方块结构清单",
    body: `清单（人在环：Agent 出步骤与草稿；Gradle / 写盘 / 上传须用户确认后执行）。对应 Skill：mc-multiblock；规则 02-block / 07-datagen。
1. 确认平台与精确 MC 版本。
2. 先 activate_platform_pack action=session（task=mc-multiblock）。结构匹配与方块实体以本档文档为准。
3. 无生成器模板时 search_*_docs 手动编写，不要理解为游戏里做不了。`,
  },
  "mc-ai": {
    title: "实体 AI / Goal 清单",
    body: `清单（人在环：Agent 出步骤与草稿；Gradle / 写盘 / 上传须用户确认后执行）。对应 Skill：mc-ai；规则 04-entity。
1. 确认平台与精确 MC 版本。
2. 先 activate_platform_pack action=session（task=mc-ai）。Goal / Brain 类名核 search_*_docs。
3. 禁止把 1.12 AI 任务表抄进 1.20+。`,
  },
  "mc-jei": {
    title: "JEI/REI 兼容清单",
    body: `清单（人在环：Agent 出步骤与草稿；Gradle / 写盘 / 上传须用户确认后执行）。
1. 软依赖。session 可读 mc-compat-jei；库集成见 knowledge/libs 与 community lib-* 短文。
2. 不要把 Fabric REI 当 Neo JEI。plugin 入口以该库文档为准。
3. 不代跑游戏、不擅自拷 mods（路径与拷贝须用户确认）。`,
  },
  "mc-ci-publish-extra": {
    title: "CI 发布额外清单",
    body: `清单（人在环：不代跑 CI、不代上传）。
1. check_publish_ready：license/version、build/libs 像正式 jar。
2. 列出建议的 GitHub Actions 步骤名（setup-java、gradle build、upload 工件）——只出清单；可复制的 YAML 模板在 community_knowledge/patterns/examples/mod-ci-github-actions.md。
3. 对照 community_knowledge/authored/publishing.md。不要调 Curse/Modrinth API。`,
  },
  "mc-setup-env": {
    title: "开发环境搭建",
    body: `1. detect_mod_project 确定平台和版本。不要默认 Forge 1.20.1。
2. Forge/NeoForge：download_official_mdk（dryRun）拿推荐 JDK / Gradle / mappings；对照 gradle.properties、build.gradle 与规则 00。
3. Fabric/Quilt：对照 fabric.mod.json / quilt.mod.json 与 gradle.properties 的 Loom、Yarn/Mojmap、Java toolchain。26.1 用 implementation，不要 modImplementation。
4. 输出：建议 JDK、runClient/runServer、映射选择、gradle.properties 修正清单。
5. 提醒用户确认后手动 ./gradlew genEclipseRuns 或 genIntellijRuns（如适用）；Agent 不代跑 Gradle。
6. validate_project：Fabric/Quilt/NeoForge 看 status passed/failed（不是 skipped）。LiteLoader/Rift/ModLoader/基岩仍 skipped，改口文档工具。任何平台都不得把「validate_project 通过」当成环境搭建结束。`,
  },
  "mc-full-mod": {
    title: "从零新模组总链",
    body: `${WORKFLOW_HITL}
【仅从零新模组】此链只适用于从零创建。修改已有代码请勿调用本工作流，改用对应 mc-new-* / 规则+Skill / search_*_docs。每一步都要停下来让用户做内容与取舍决策；不要当成无人值守流水线一次跑完。
1. mc-setup-env：detect_mod_project + 该平台 JDK/Gradle/映射；从零才 download_official_mdk（先 dryRun）。
2. 按需求串联对应 mc-new-*（方块/物品/方块实体/实体/GUI/世界生成等）；每次先 activate_platform_pack action=session。
3. mc-build-mod：validate_project 看 status，再构建产出 jar。
4. mc-ingame-iterate：隔离实例 mods 目录 + 读 latest.log / crash-reports。
5. 可选 mc-localize-mod（无机器翻译）。
6. mc-publish：check_publish_ready；用户自行上传。不要把本链当改已有代码的入口。`,
  },
};

export function getWorkflowTemplate(name: string): { found: boolean; name: string; title?: string; body?: string } {
  const t = ownGet(WORKFLOW_TEMPLATES, name);
  if (!t) {
    return { found: false, name, body: `可用模板: ${Object.keys(WORKFLOW_TEMPLATES).join(", ")}` };
  }
  return { found: true, name, title: t.title, body: t.body };
}

export function listWorkflowTemplateNames(): string[] {
  return Object.keys(WORKFLOW_TEMPLATES);
}
