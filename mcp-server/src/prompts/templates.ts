export const WORKFLOW_TEMPLATES: Record<string, { title: string; body: string }> = {
  "mc-new-block": {
    title: "新方块工作流",
    body: `1. DeferredRegister 注册方块（mc-registry / 01-registry）
2. 注册 BlockItem（同名）
3. blockstates + 模型（generate_model 或 DataGen）
4. lang en_us/zh_cn（generate_lang）
5. loot table（generate_datagen loottable）
6. 可选：tags、recipe DataGen`,
  },
  "mc-new-entity": {
    title: "新实体工作流",
    body: `1. EntityType DeferredRegister + 属性（mc-entity）
2. 注册 SpawnPlacement / 生物蛋
3. 客户端 EntityRenderer（generate_entity_renderer）
4. loot / 音效按需`,
  },
  "mc-new-gui": {
    title: "GUI 工作流",
    body: `1. MenuType + AbstractContainerMenu（mc-gui）
2. Screen + MenuScreens.register
3. SimpleChannel 同步槽位（mc-networking）`,
  },
  "mc-crash-triage": {
    title: "崩溃分诊",
    body: `1. analyze_log / crash_analyze
2. search_community_docs 按 crashKind
3. validate_project + mixin_analyze
4. diagnose_gradle 若启动阶段失败`,
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
    body: `1. 确认平台 / MC 版本 / mappings（读 mods.toml 或 fabric.mod.json、build.gradle）
2. validate_project；必要时 diagnose_gradle / check_dependencies
3. 构建：Forge/NeoForge 用 ./gradlew build；Fabric 用 Loom 等价任务；需要资源时先跑 DataGen
4. 确认产出 jar：build/libs/（排除 -sources、-javadoc 等）
5. 构建失败：对 Gradle/编译日志用 analyze_log / crash_analyze，修好后重跑构建
6. 完成后可接工作流 mc-ingame-iterate（真机测试与修复循环）`,
  },
  "mc-ingame-iterate": {
    title: "真机测试与修复循环",
    body: `【前置】未向用户索取路径前禁止臆造盘符。本波仅指导复制/核对路径，不自动写盘到游戏目录。

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

3. 将最新构建 jar 放入确认后的 modsDir（可选备份旧同名 jar）；提醒关闭正在运行的游戏
4. 用同一启动器启动该隔离实例；复现问题
5. 读取该实例 logs/latest.log 与 crash-reports/ → analyze_log / crash_analyze；可配合 search_community_docs、mixin_analyze
6. 修代码 → 走 mc-build-mod 再构建 → 换 jar 再测（循环直到通过）
7. 可选兼容性测试：同实例或第二实例；基线（目标 mod + 硬依赖）→ 逐步加入其它 mod；记录冲突与加载顺序
   （HMCL 切换版本场景可参考「隐藏启动器并在游戏结束后重新打开」）`,
  },
  "mc-localize-mod": {
    title: "模组汉化工作流",
    body: `【原则】不调用外网机翻 API；localize_mod 只做 diff/草稿/抽 jar；中文由 Agent 填写。默认不写游戏目录。
社区短文：authored/localization-lang；新建骨架可用 generate_lang。

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
5. 可选：无 lang 骨架时先 generate_lang`,
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
};

export function getWorkflowTemplate(name: string): { found: boolean; name: string; title?: string; body?: string } {
  const t = WORKFLOW_TEMPLATES[name];
  if (!t) {
    return { found: false, name, body: `可用模板: ${Object.keys(WORKFLOW_TEMPLATES).join(", ")}` };
  }
  return { found: true, name, title: t.title, body: t.body };
}

export function listWorkflowTemplateNames(): string[] {
  return Object.keys(WORKFLOW_TEMPLATES);
}
