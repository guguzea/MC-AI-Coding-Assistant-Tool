---
id: authored/forge-dev-env-pitfalls
title: Forge 开发环境常见坑（Parchment / 证书 / assets / Git）
tags: [gradle, parchment, git, idea, forge, setup, assets]
summary: 三类命名；Parchment 切换；证书与离线 assets 双步；JavaCompile 警告；.gitignore；勿手塞 run/mods。
mcHint: 1.20.1+
sourceKind: authored
---

# Forge 开发环境常见坑（Parchment / 证书 / assets / Git）

自写短文。具体坐标以当前 MDK / 官方 Getting Started 为准；改完 Gradle 后 **Reload**。

## 三类命名（创建工程时）

| 名称 | 给谁看 | 规则 | 发布后 |
|------|--------|------|--------|
| modId | 游戏/资源/存档 | 小写+下划线 | **基本不要改** |
| 显示名 | 玩家 | 可任意 | 可改 |
| 工程/文件夹名 | 开发者 | 任意 | 可改 |

包名与 `src/main/java` 目录一致；常用反向域名（`org.xxx.modid`）。

## 目录角色

| 路径 | 作用 |
|------|------|
| 项目根 | 含 `build.gradle` / `gradlew`；终端命令在此执行 |
| `src/main/java` | 代码 |
| `src/main/resources` | 资产与数据 |
| `build/libs` | 发布 jar |
| `run/` | 开发用 MC 实例（日志、存档） |

**不要**把手搓的 jar 丢进 `run/mods` 指望开发环境加载——应用 runClient 的注入机制。

## Parchment（可读参数名）

1. `settings.gradle` 的 pluginManagement 增加 Parchment Maven。  
2. `gradle.properties`：`mapping_channel=parchment`，`mapping_version=…-1.20.1`（版本号跟 MDK/文档）。  
3. `build.gradle` plugins 增加 parchment librarian / forgegradle 文档要求的插件。  
4. Reload + 必要时重新 gen/runs。  

勿与另一套映射混用。换映射后 IDE 索引异常时 Invalidate / 再导入。

## 网络与构建稳定性

1. **证书校验失败**（依赖下不下来）  
   社区常见在 `org.gradle.jvmargs` 加 ForgeGradle 文档所述的 check.certs=false 一类开关。  
   **仅开发权宜**，明白安全含义后再用。

2. **assets 反复下载**  
   仅改 `assets_root` 环境变量往往不够；需同时：  
   - 让 runs 指向本地 assets 目录；  
   - 去掉/禁用相关 `downloadAssets` 任务依赖（`prepareRun*` / `runClient` / `runData` 等）。  
   两步都做才稳定；只影响开发环境，不进发布 jar。

3. **@Removal / 弃用警告打断 runData**  
   - 编译：可对 `JavaCompile` 设 UTF-8，并按需 `-Xlint:-removal`（保留普通 deprecation 提醒更稳妥）。  
   - IDEA：可关闭「Marked for removal」检查，避免编辑器噪音；仍建议逐步迁移 API。

## Git 建议忽略

```
/run/
/run-data/
/build/
/.gradle/
/.idea/
/gradle/          # 若使用 wrapper 则保留 gradle/wrapper 策略按团队约定
/src/generated/resources/.cache/
```

原则：提交源码与构建脚本；不提交运行缓存与本地 IDE。License 推荐在仓库创建时选好（如 MIT）。

## 自检

- `runClient` 能进游戏且 Mod 列表可见。  
- `build` 产物在 `build/libs`，可被干净环境加载。  
- 弱网下不再每次全量拉 assets（若已配置离线）。

## 不清楚时

- 官方 Getting Started / 当前 MDK 注释（Parchment 插件名会变）  
- 工程化外链（禁转载，仅浏览）：https://www.mcmod.cn/post/6071.html  
- Gradle 问题：MCP `diagnose_gradle`
