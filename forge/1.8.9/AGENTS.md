# Forge 1.8.9

核实表：knowledge/common/verified-api.md（若本档无表则仅 search_forge_docs version=1.8.9）。
改口：search_docs({platform:"forge", version:"1.8.9"}) / search_forge_docs(version="1.8.9")。
薄档：仅 00/01/09。禁止 DeferredRegister、Capability、DataGen、1.12.2/1.16+ API。
方法名只许来自本版 javadoc / search_forge_docs；禁止从 forge/1.7.10 或 forge/1.12.2 拷贝教程当本版全文。

## 配置（不落盘树级 mc-config）

不要为本档新写 mc-config Skill。配置走仓库根 knowledge/libs/all-platforms/mc-config/SKILL.md + generate_config（工作流 mc-config）。本档年代不要套 Cloth / ForgeConfigSpec 现代形态。

<!-- MC_SKILL_WORKFLOW_NOTE -->

## 工作流提醒（人在环）

完整流程才调 get_workflow_template；改已有代码走规则 + search_forge_docs。写盘 / Gradle / 拷 jar / 上传均须用户确认。
