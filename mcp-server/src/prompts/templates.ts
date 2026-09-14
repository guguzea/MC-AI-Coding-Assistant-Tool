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
3. 反编译：decompile_mod_jar { jarPath, version?, mapping? } → $MC_SKILL_CACHE/decompiled-mods/<modId>/<version>-<jarSha512_12>/ 源码树摘要
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
   - Fabric/Quilt：默认 Cloth Config（mc-config Skill）；不要生成 ForgeConfigSpec。\`generate_config\` 的 \`library\` 参数为 opt-in 枚举 cloth|yacl（默认 cloth），只有用户显式要 YACL 才传 yacl。
   - 传了 library=yacl：返回的是结构壳（除类声明与已核实成员名外全是 \`// TODO(未核实)\`），编译前必须由用户自备 yacl jar 跑一次 ingest_loader_api（默认 dryRun，只写 $MC_SKILL_CACHE overlay）再 query_loader_api 逐签名核对；禁止凭记忆补 YetAnotherConfigLib / @ConfigInstance / ModMenuApi 方法链。
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
4. 可选 check_publish_ready（若已注册）做机器检查：license/version、build/libs 加本清单点名的元数据字段缺项（只 warning）；默认不写盘、不调外网
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
3. generate_datagen 仅白名单版本（Forge 1.20.1 / 1.20.4 FinishedRecipe；NeoForge 1.20.1 改口 search_neoforge_docs，禁止默写 Forge import；NeoForge 1.20.4 / 1.20.6 仅 recipe——1.20.4 一参 PackOutput+RecipeOutput，1.20.6 两参 PackOutput+HolderLookup；1.21.0–1.21.4 为 GatherDataEvent+addProvider，1.21.5+ 为 GatherDataEvent.Client+createProvider，1.21.11/26.1 用 Identifier；Fabric 方法名按**映射**取（Yarn=generate(RecipeExporter) / Mojmap=buildRecipes，同类同名差异，不是版本差异，禁止同一文件混映射），26.1 Loom；Quilt 无足够 QSL 类名则 error）。其它版本 search_*_docs + 手写，参考 07-datagen / mc-datagen。
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
1. check_publish_ready：license/version、build/libs 像正式 jar，并给出 publishing.md 清单里可机器核的缺项（只 warning，不阻断）。
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
  "mc-datapack-standalone": {
    title: "独立数据包工作流（无 Java 代码）",
    body: `${WORKFLOW_HITL}
${WORKFLOW_ERA_GUARD}
【适用】纯数据包：世界 datapacks/ 目录或独立 zip，无 build.gradle、无 Java 源码。模组附带的配方/战利品走 mc-recipe-data 与对应平台 session，不要把数据包当模组工程判结构。
1. 【停】先与用户确认并等回复，不要自行开工：精确 MC 版本、目标命名空间 ns、要覆盖的数据面（recipe / loot_table / advancement / tag / function / damage_type）。pack_format 随版本变，禁止默认 1.20.1。
2. 结构：pack.mcmeta + data/<ns>/<kind>/*.json。1.21 起 loot / recipe / tag 的目录层级与字段有分叉，逐档取：search_docs（platform=实际加载器档，version=精确档）或 get_doc_full 读整页；核不到就留 TODO(未核实)，禁止拿邻版目录树顶替。
3. 函数 / 命令面同样按档核（命令参数跨版本变），核不到不要凭记忆写。
4. 逐文件校验：validate_datapack_json（须传精确 version；kind=recipe|loot_table|advancement|tag）。【边界】它不是全 pack_format 官方 schema，passed 不等于游戏一定认。
5. 有音效 / 文本 / 模型的部分另走 mc-resourcepack-standalone；混包时数据包与资源包两册 pack.mcmeta 分开写，不要合成一册。
6. 【停】打包与装载由用户执行：Agent 只出文件清单与结构预览（dryRun 口径），不代写 saves/<world>/datapacks，不代跑 /reload，不代跑启动器。
7. 装载后不生效：读该实例 logs 走 analyze_log / crash_analyze；先查 ns 拼写与目录层级、再查 pack_format，最后才怀疑语法。`,
  },
  "mc-resourcepack-standalone": {
    title: "独立资源包工作流",
    body: `${WORKFLOW_HITL}
${WORKFLOW_ERA_GUARD}
【适用】纯资源包：resourcepacks/ 目录或独立 zip（模型 / 方块状态 / 纹理 / lang / 音效 / GUI 贴图）。模组内资源走对应平台 session 与该档规则，不走本流程。
1. 【停】与用户确认后再落文件：精确 MC 版本、pack_format、命名空间、要改的资产面。pack_format 与模型语法跨版本变，禁止默认 1.20.1。
2. 结构：pack.mcmeta + assets/<ns>/blockstates|models|textures|lang|sounds。逐档核字段：search_docs / get_doc_full 取该版模型语法，核不到留 TODO(未核实)。
3. 骨架生成（只吐文本 + suggestedPath，默认不写盘）：generate_model（version 必填；kind=block|item）、generate_lang（version 必填；en_us/zh_cn）。注意这两个工具只有 version 必填、无 platform 参数，且 suggestedPath 面向模组工程的 assets/<modid>/——独立资源包要用户确认后自己挪目录，别当已就位。
4. 静态自检：audit_resources 传 resourceRoot（该包的 assets/<ns> 根）或 projectPath 让工具自推，看缺失纹理 / 孤儿纹理 / modId 命名。它只查引用完整性，不判 pack_format。
5. 汉化面接 mc-localize-mod（无机器翻译，中文由人填）。
6. 【停】打包与安装由用户执行：Agent 不代写 resourcepacks/、不代跑启动器。zip 根必须是 pack.mcmeta，不要多套一层目录。
7. 生效核对：游戏内重载资源包逐项看模型 / 纹理 / 文案；异常读 logs 走 analyze_log。`,
  },
  "mc-rendering": {
    title: "渲染工作流（BER / 自定义模型加载器 / 着色器）",
    body: `${WORKFLOW_HITL}
${WORKFLOW_ERA_GUARD}
【分叉】渲染注册入口按平台 + 版本分叉，禁止一条 API 名覆盖全档。先确认平台与精确 MC 版本，再 activate_platform_pack action=session（可 task=mc-new-blockentity / mc-new-entity）取该档核实表；禁止 Read 平台/<ver>/.cursor。
1. 【停】与用户确认要渲的是方块实体（BER）、实体渲染器、还是模型加载 / 着色器，以及目标档；不同答案走完全不同的注册面，不要混。
2. BER：
   - Forge 1.20.1：mod 总线订阅 EntityRenderersEvent.RegisterRenderers 并调 #registerBlockEntityRenderer（已核实 data/forge_1.20.1/forge-docs/1.20.1/processed/blockentities_ber.md:26）。
   - NeoForge 1.21.1：同名事件 + event.registerBlockEntityRenderer（已核实 data/neoforge_1.21.1/neoforge-docs/1.21.1/processed/blockentities_ber.md:51,57,59）。其余 Neo 档（1.20.4 / 1.20.6 / 1.21.3 / 1.21.5 / 1.21.8 / 1.21.10 / 1.21.11 / 26.1）本模板未逐档核实 → 改口 search_neoforge_docs version=该档。
   - Fabric / Quilt：渲染注册入口类名在本仓全部 fabric 语料 0 命中（grep -rln EntityRendererRegistry data/ 无结果）⇒ TODO(未核实)，禁止默写。1.21.11 只核实到「BER 在 ClientModInitializer 里注册」（develop_blocks_block-entity-renderer.md:44）与 EntityRenderState（develop_entities_first-entity.md:65）。要签名先 search_fabric_docs，再由用户自备渲染 jar 走 ingest_loader_api + query_loader_api 逐条核对。
   - Rift 1.13.2：核实表监听器 org.dimdev.rift.listener.client.EntityRendererAdder 的 addEntityRenderers(Map, RenderManager)，方块实体侧 TileEntityRendererAdder 的 addTileEntityRenderers(Map)（已核实 data/rift_1.13.2/rift-docs/1.13.2/processed/listeners.md:51,57）。表外名字禁止输出。
   - LiteLoader / ModLoader：只使用该档核实表里的渲染钩子；表里没有就停，不要吐现代 BER 骨架。
3. 实体渲染器骨架：generate_entity_renderer 的 platform 与 version 必填，当前只覆盖 forge 1.18.2 / 1.19.4 / 1.20.1 / 1.20.4 与 neoforge 26.1，fabric / quilt 直接 error（见工具描述）。不支持档改口该档 04 + search_*_docs，不要绕道硬写。
4. 自定义模型加载器：NeoForge 1.21.1 走 ModelEvent.RegisterGeometryLoaders + 实现 IGeometryLoader（已核实 data/neoforge_1.21.1/neoforge-docs/1.21.1/processed/resources_client_models_modelloaders.md:323,335）。Forge 1.20.1 另有 rendering_modelloaders 系列专页但本模板未逐页取签名 → 那一档改口 get_forge_doc_full 核过再写，禁止把 Neo 名字抄进 Forge。基岩没有模型加载器概念，走 RP 定义。
5. 着色器 / 后处理：本仓 neoforge_1.21.1 与 fabric_1.21.11 的 processed 无着色器专页（ls 实核）⇒ 整面 TODO(未核实)。禁止默写 shader 实例类名、后处理管线名、GLSL include 语法；改口 get_minecraft_source 或由用户自备源码逐签名核。
6. 跨端纪律：渲染类只许在客户端侧加载，服务端引用即崩；按该档 08 做分离。
7. 【停】构建与真机看效果由用户执行（不代跑 Gradle、不代拷 jar）；可接 mc-ingame-iterate 或 mc-server-multiplayer-test。`,
  },
  "mc-profiling": {
    title: "性能剖析工作流",
    body: `${WORKFLOW_HITL}
${WORKFLOW_ERA_GUARD}
【定位】卡顿 / 内存 / 耗时的独立剖析面。mc-crash-triage 第 5 步与 mc-build-mod 第 7 步只留了「先读短文再改代码」一句，要走完整剖析用本模板。原则：先测量后优化，没有数据的瓶颈不改。
1. 【停】与用户确认瓶颈类型（服务端 tick / 客户端帧率 / 内存 / 加载耗时 / 构建慢）和可接受的取舍——优化常换实现，属性能权衡，由用户拍板，不要自作主张重写。
2. 主读 community_knowledge/authored/profiling-performance.md：先测量原则:14、spark:20-24（/spark profiler、/spark tps、/spark gcmonitor）、原版 /debug start 与 /debug stop 产物在 debug/ 下:26-28、客户端帧率与 /sparkc:31-34、内存诊断:36、「先测量后优化」清单:45-51。检索用 search_community_docs，整篇用 get_community_doc_full。短文不替代官方 API 规范。
3. 服务端 tick：spark 由用户自行安装与采样（Agent 不代下载、不代起服、不代跑 profiler）；无 spark 时用原版 /debug start → 复现 → /debug stop。采样回来的日志用 analyze_log，运行时目录用 inspect_runtime（优先 logsDir，禁止全盘探测）。
4. 客户端 / 自埋段：NeoForge 1.21.1 有 Debug Profiler 专页——F3 + L 起停、10 秒自动停（已核实 data/neoforge_1.21.1/neoforge-docs/1.21.1/processed/misc_debugprofiler.md:7）；自定义段 ProfilerFiller#push / #pop，实例取自 Level / MinecraftServer / Minecraft（同页 :57,61,65）。其它档改口 search_neoforge_docs / search_forge_docs version=该档，禁止把 1.21.1 页当全档通用。
5. 热点属于未知模组时：analyze_mod_jar → decompile_mod_jar → search_mod_code（首次 3-10 分钟，默认只写 $MC_SKILL_CACHE，不写项目目录）。
6. 构建慢不属本面：analyze_build_log + diagnose_gradle（先看 status / skipped），别拿运行时剖析器量编译。
7. 老平台（LiteLoader / Rift / ModLoader）没有现代 profiler 文档页 ⇒ 只按该档核实表；核不到就退回「二分关闭模组」的经验定位，禁止吐 spark / ProfilerFiller 骨架。
8. 【停】优化改法交用户确认后再动代码；改完由用户自己构建与复测（不代跑 Gradle、不代拷 jar），一次只改一处、重测对比。`,
  },
  "mc-save-migration": {
    title: "存档数据结构迁移工作流",
    body: `${WORKFLOW_HITL}
${WORKFLOW_ERA_GUARD}
【适用】存档数据结构变更：SavedData 的 .dat 内容、方块实体 / 实体 / 区块读写格式、以及跨版本升级旧世界的兼容面。
1. 【停 · 强制第一步】改存档 schema 之前，必须先让用户整份备份世界目录并回报备份路径，确认后才进第 2 步。本模板只出代码与人工步骤清单：Agent 不代改真实存档、不代写 saves/ 下的 .dat 与 region 文件、不代跑任何迁移命令。没备份就停在这里。
2. 确认平台 + 精确 MC 版本 + 兼容窗口：要不要读旧档？读不了时是报错、静默重置还是回退默认值？这是破坏性取舍，用户定。
3. 持久化面先选型：读 community_knowledge/authored/saveddata-world-persistence.md —— 适用场景:14、旧 API（≤1.20.6 的 DimensionDataStorage + Factory + NBT）:25、新 API（≥1.21.5 的 SavedDataType + Codec）:59、setDirty 是最常见丢档原因:81、挂哪个维度:85、反模式:97。Fabric 侧另读 authored/fabric-saveddata-persistent-state.md。短文不替代官方签名。
4. NeoForge 1.21.1 已核实面：SavedData 子类要实现 save 并在改数据后调 setDirty（不调则原数据不变）；实例经 DimensionDataStorage#computeIfAbsent 取得，参数是 SavedData.Factory（新建 supplier + 读 NBT 函数）与 .dat 文件名（不得含路径分隔符）；存储入口 ServerChunkCache#getDataStorage 或 ServerLevel#getDataStorage（data/neoforge_1.21.1/neoforge-docs/1.21.1/processed/datastorage_saveddata.md:9,12,18,20）。其它 Neo 档未逐档核实 ⇒ 改口 search_neoforge_docs version=该档，禁止把 1.21.1 签名抄进 1.20.4 / 1.20.6。
5. 版本字段与迁移路径由你自己定义：在自写数据里放显式整数版本字段，加载时逐段升级（v1 到 v2 到 v3，不要跳级重写），并把「无版本字段的旧档」当 v0 特例。这套 schema 版本是本模组约定，不是原版 API。
6. DataFixer / type-updating 面：本仓 neoforge_1.21.1 的 datastorage_codecs.md:3,13 只把 DataFixerUpper 当成 Codecs 序列化库来讲，正文没有任何游戏侧 DataFixer / 版本升级器注册流程 ⇒ 该面整片 TODO(未核实)。要落笔必须先 get_minecraft_source（原版类）或 query_api（覆盖约 1.16.5-1.20.4，1.21+ / 26.1+ 无索引）核到签名，核不到就写 TODO(未核实)，禁止凭记忆补升级器类名与方法链。
7. Codec 面（若走新版持久化）：NeoForge 1.21.1 有 datastorage_codecs.md 专页可整篇 get_neoforge_doc_full 读；跨端读写另接 StreamCodec（同档 networking_streamcodecs.md）。没读页就别说方法名。
8. 兼容性验证（人工、只在测试档）：复制一份旧世界 → 只改代码不动数据先加载，看是崩溃还是把旧数据清零 → 再加载一次让它写新 schema → 第三次加载验幂等。全程 analyze_log / crash_analyze 读日志。禁止拿正式存档试。
9. 【停】「旧档不兼容时的处置」（拒绝加载 / 自动升级 / 放弃旧数据）必须用户选定后再写代码；发布说明里的破坏性变更措辞由用户决定（可接 mc-publish 清单，不代上传）。`,
  },
  "mc-server-multiplayer-test": {
    title: "服务端与多人联机测试工作流",
    body: `${WORKFLOW_HITL}
${WORKFLOW_ERA_GUARD}
【适用】联机侧验证：专用服务端、多客户端同房、状态同步、权限与延迟下的行为。构建本身走 mc-build-mod，单机真机走 mc-ingame-iterate。
1. 【停】与用户确认测试拓扑：几个客户端、是否服务端与客户端两套环境、要不要第二台机器。端口开放、EULA、白名单 / op 全部由用户操作，Agent 不代起服务器、不代改防火墙。
2. 起服与连服由用户执行（runServer 或启动器）。Agent 只列需要哪份 jar、哪个 mods 目录、看哪个日志路径；不代跑 Gradle、不代把 jar 拷进服务端目录。
3. 分诊输入要分侧：服务端 logs 与各客户端 logs 分开取（inspect_runtime 优先 logsDir，禁止全盘探测）→ analyze_log / crash_analyze 按时间戳对照。客户端崩溃别当服务端崩溃修。
4. 同步面逐项两人同房实测：服务端权威的状态变更、方块实体 / 实体数据是否下发、GUI 打开与关闭、重进世界与跨维度、死亡与重生。网络骨架接 mc-networking（generate_network_packet 的 platform 必填且须带版本后缀，如 forge_1.20.1 / neoforge_1.21.1 / fabric_26.1.2；只传 fabric 会 error，未列出的组合一律拒绝）。
5. 端分离纪律：客户端专用类被服务端引用即崩。按该档 08 与 session 注入的分端规则查，禁止靠「运行时猜物理端」。有 Mixin 时用 mixin_analyze 核对 common / client / server 分桶，别把 common 写进 client。
6. 权限面必测非 op 玩家路径；命令注册按该档文档（现代档为 Brigadier 系，可读 authored/custom-commands-brigadier.md），核不到留 TODO(未核实)。
7. 能不能自动化先判：读 community_knowledge/authored/testing-automation.md —— 选型:14、JUnit 只能测干净逻辑:23、按 loader 的 test 配置:29、可测性设计清单:36、客户端渲染类的现实路径:43。GameTest 面走 mc-gametest。短文不替代官方签名。
8. 依赖与共存：check_dependencies 看依赖与版本窗口；加载顺序与 mod 间冲突分诊另走 mc-modpack。
9. 【停】性能与卡顿不属本流程：转 mc-profiling（先测量再改）。联机「卡」常常是带宽或实现往返，不由 Agent 单方面改协议。`,
  },
  "mc-combat-attribute": {
    title: "伤害 / 属性 / 战斗工作流",
    body: `${WORKFLOW_HITL}
${WORKFLOW_ERA_GUARD}
【适用】伤害种类、实体属性与加成、战斗数值。附魔 / 药水 / 效果走 mc-enchant-potion，战利品走 mc-recipe-data。
1. 【停】与用户确认平台 + 精确 MC 版本，以及要改的是「伤害种类」「实体属性」还是「战斗事件」；数值倍率属创意与平衡决策，由用户拍板，Agent 不代定。参数纪律：本面下游工具 platform / version 必填（activate_platform_pack 需 platform + minecraftVersion；generate_entity_renderer 需 platform 与 version；generate_network_packet 的 platform 需带版本后缀），缺省即 INVALID_INPUT / 直接 error，版本没落实就不要往下要骨架。
2. 伤害类型（现代档为数据驱动）：NeoForge 1.21.1 已核实——DamageType 是数据包 registry，代码侧只提供 ResourceKey，属性写在 data/<modid>/damage_type/<name>.json（已核实 data/neoforge_1.21.1/neoforge-docs/1.21.1/processed/resources_server_damagetypes.md:1,7,19）；构造 DamageSource 需要 RegistryAccess，取自 Level#registryAccess（同页 :72）；DamageSources#source 会调换 direct 与 causing 两个实体参数，别传反（同页 :109）。Forge 同族页存在但本模板未逐页取签名 ⇒ 那一档改口 get_forge_doc_full 读过再写。
3. 实体属性：只许逐档核。vanilla 索引可核到 net.minecraft.world.entity.ai.attributes.Attributes 及其 register(String, Attribute)（实测 query_api className=Attributes version=1.20.1 → found:true；query_api 只覆盖约 1.16.5-1.20.4）。1.20.5 起属性面跨版本差异大，且本仓 neoforge_1.21.1 与 forge_1.20.1 的 processed 都没有 attributes 专页（实核 0 命中）⇒ 属性注册与 modifier 施加点在 ≥1.20.5 一律 TODO(未核实)，必须 get_minecraft_source 或 query_loader_api（先 ingest_loader_api，用户自备 jar）核到签名才写。禁止拿 1.20.1 的名字覆盖全档。
4. 战斗事件名改过多次：LivingHurt / LivingIncomingDamage 一类在本仓 forge_1.20.1 与 neoforge_1.21.1 语料 0 命中 ⇒ TODO(未核实)。要拦伤害先 search_*_docs（version=该档）定位事件面，需要注入口时用 get_minecraft_source + mixin_analyze；核不到就不要写注入目标。
5. 端侧纪律：战斗数值在服务端算，客户端只显示；血量 / 冷却同步接 mc-networking 与该档 06，禁止客户端直接改服务端实体数据。
6. 表现层（受击动画 / 粒子 / 音效）接 mc-audio-vfx 与 mc-rendering，不要在本流程里顺手写渲染注册。
7. 【停】数值表交用户确认后再落常量；构建与实测由用户执行（不代跑 Gradle、不代拷 jar），联机下的战斗一致性另走 mc-server-multiplayer-test。`,
  },
  "mc-multi-loader": {
    title: "多加载器（Architectury）工作流",
    body: `${WORKFLOW_HITL}
${WORKFLOW_ERA_GUARD}
【适用】一份源码同时产出 Fabric / NeoForge（或 Forge）多加载器构建的 Architectury 工程。已有工程改代码走对应平台 session，不走本流程。
1. 【停】与用户确认：是否真要上多加载器（构建与调试成本翻倍，属取舍）、目标 loader 清单与各自精确 MC 版本、modId。参数纪律：下游 generate_* 与 activate_platform_pack 的 platform / version 必填（platform 需带版本后缀，只传裸 loader 名会 error），版本未定就先别要骨架。
2. 选型读短文 community_knowledge/authored/lib-architectury.md：何时用 / 何时不用:20、Decision Flow:30、Gradle 与声明文件检查顺序:43、集成要点:51、常见坑:66、自检清单:74。短文不替代 API 签名。
3. 库 Skill 源稿：knowledge/libs/all-platforms/mc-architectury/SKILL.md —— 直接读源稿，不落盘到平台 .cursor/skills（库组映射与 frontmatter 的 platforms / mcVersions 过滤见 knowledge/libs/README.md）。
4. 脚手架：先 analyze_porting_path 看路线，再 port_project action=init_architectury。该动作必须传 neoforgeVersion（写进 gradle.properties 的 neoforge_version，缺省即被拒），modId 不给则从目录名推导，且只适用于空目录；已有工程改用 action=extract_common / apply_version_migration。port_project 的写文件默认 dryRun=true，只出 diff 预览。
5. 【停】把第 4 步的 dryRun 预览清单原样给用户过目、得到确认后，才允许 dryRun=false + confirmed=true 真写（另需环境 MC_SKILL_ALLOW_WRITE=1 且 projectPath 落在 MC_SKILL_PROJECT_ROOT 内）。Agent 不擅自落盘、不代跑 Gradle、不代拷产物。
6. 抽象层签名：Architectury 与各 loader 的入口类名 / 方法名一律 query_loader_api 逐条核（先由用户自备 architectury jar 走 ingest_loader_api，它只写 $MC_SKILL_CACHE overlay，不写仓库 data/）。未入库 ⇒ 只留 TODO(未核实) 结构壳，禁止凭记忆补方法链。
7. 三套声明文件（common / fabric / loader 侧）按各自档写；跨加载器库冲突与依赖窗口用 check_dependencies 预检（它是启发式 + library-catalog，不是 Gradle 依赖解析器，未收录库可能漏报）。
8. 产物与发布：各 loader 分别出 jar，发布前清单接 mc-publish 与 mc-ci-publish-extra，由用户自行上传（不代传 Curse / Modrinth）。移植旧工程另走 mc-port-mod。`,
  },
  "mc-modpack": {
    title: "整合包集成工作流",
    body: `${WORKFLOW_HITL}
${WORKFLOW_ERA_GUARD}
【适用】整合包：把第三方 mod 装成一套能跑的包——依赖闭包、加载顺序、冲突分诊。本流程不做自动发布，也不代下载 / 代上传 mod 文件。
1. 【停】向用户索取 mod 清单与每个 jar 的本地绝对路径（禁止臆造盘符、禁止猜下载源）。参数纪律：本面下游工具 platform / version 必填（activate_platform_pack 需 platform + minecraftVersion，generate_* 需带版本后缀的 platform，validate_datapack_json 与 audit_resources 建议传精确 version / modId），缺省即 INVALID_INPUT / 直接 error。
2. 逐 jar 摸元数据：analyze_mod_jar 读 modId / loaders / entrypoints / mixins / 依赖声明。它只读用户自备 jar。
3. 依赖闭包与版本窗口：check_dependencies（loader 判定、库模组识别、跨加载器冲突如 owo / CCA / Polymer / Trinkets、常见陷阱）。【边界】启发式 + catalog，不是 Gradle 依赖解析器 ⇒ 报「没问题」不等于一定共存，最终以真机为准。
4. 软 / 硬依赖：读 community_knowledge/authored/soft-deps-modlist.md（硬依赖 vs 软依赖:14、Forge 运行时探测:22、mods.toml 声明建议:37、常见错误:52、自检:59）。Fabric 的 depends / breaks 与 Forge 系 orderings 语义不同，按各自加载器档核，不要互抄。
5. 加载顺序：只在确有先后依赖时处理；声明面按该版加载器文档核（本模板不预设顺序 API 名，核不到留 TODO(未核实)）。
6. 冲突分诊走 mc-crash-triage 主干：analyze_log / crash_analyze / lookup_obfuscated（崩溃短名反查）/ mixin_analyze（注入目标缺失）；diagnose_gradle 只用于构建期。换 jar、删 jar、改目录这些动作由用户执行，Agent 只出「这轮先关掉哪些」的清单。
7. 资源与配方面冲突：audit_resources 看模型 / 纹理引用与命名空间（传 resourceRoot 或 projectPath）；配方 / 战利品 / 进度 / 标签 JSON 用 validate_datapack_json 且必须传精确 version。两者都不判同名覆盖优先级，那要按档查文档。
8. 真机验证接 mc-ingame-iterate（隔离实例、路径与拷贝先经用户确认）；多人服务端表现接 mc-server-multiplayer-test；卡顿与内存接 mc-profiling。
9. 【停】发布与分发不在本流程内：不代调 Curse / Modrinth 上传接口、不代下第三方 jar；每个 mod 的授权与再分发条款由用户自行核对（可接 mc-publish 与 mc-ci-publish-extra，二者都只出清单）。`,
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
