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
