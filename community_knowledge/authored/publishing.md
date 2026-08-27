---
mcHint: 全版本通用；reobf 仅 FG≤1.20.4，MDG/NeoGradle/26.1+ 免 reobf
id: authored/publishing
title: 模组发布要点（CurseForge / Modrinth / GitHub / Maven）
tags: [publishing, curseforge, modrinth, maven, release, readme]
summary: 分发渠道对比、发布前检查、reobf jar、自建 Maven（mcmodsrepo）、README 徽章与附属说明。
sourceKind: authored
---

# 模组发布要点（CurseForge / Modrinth / GitHub / Maven）

自写短文。查渠道实操可配合 `search_community_docs`；API 以官方文档为准。

## 渠道怎么选

| 渠道 | 玩家分发 | 审核 | 给别人写附属 | 备注 |
|------|----------|------|--------------|------|
| CurseForge | 很常见 | 相对好过 | CurseMaven 方便 | 文件页有 projectId / fileId |
| Modrinth | 增长快 | 往往更严 | 另有 Maven 生态 | 版本元数据要写准 |
| GitHub Releases | 开发者友好 | 无 | 可挂自建 Maven | 源码 + jar 同仓 |
| MC百科等 | 中文曝光 | 不定 | 弱 | 偏收录与攻略 |

常见组合：**CurseForge 和/或 Modrinth 给玩家** + **GitHub 给源码与 Maven**。

## 发布前检查清单

1. **元数据**  
   - Forge：`mods.toml` 的 `modId`（全小写）、`version`、`license`、`displayName`、`description`  
   - `[[dependencies.*]]`：`forge` / `minecraft`（及真实硬前置）的 `mandatory`、`versionRange`、`side`  
2. **产物**  
   - 使用 `gradlew build`（或 IDE `build`），取 **reobf 后** 的 jar（Forge 流程里通常 `jar.finalizedBy('reobfJar')`）  
   - 路径多在 `build/libs/`；不要把手改、未混淆的开发 jar 当正式包  
3. **版本说明**  
   - 支持的 MC + loader 版本写进更新日志与平台「Game versions」  
   - changelog 写清破坏性变更（改注册名、改配方 id）  
4. **资源**  
   - logo / 截图符合站点尺寸与版权要求；`logoFile` 若在 toml 声明，文件需在资源根可被加载  
5. **自测**  
   - 干净客户端（仅本模组 + 声明依赖）能进世界  
   - 专用服能启动（无客户端类泄漏）

## 自建 Maven（供附属模组依赖）

适合「希望别人用 `implementation fg.deobf(...)` 引用你的 API」：

1. 在 `build.gradle` 配置 `publishing` / `MavenPublication`，本地仓库名常见为 `mcmodsrepo`  
2. 跑 `publish`（或 IDE Publishing 任务），生成带 `maven-metadata.xml` 的目录树  
3. 从 metadata 确认 **groupId / artifactId / version**  
4. 把 `mcmodsrepo/` 推到 GitHub 后，附属方仓库 URL 用 raw 形式，例如：  
   `https://raw.githubusercontent.com/<user>/<repo>/<branch>/mcmodsrepo/`  
   （不要用 GitHub 网页 `tree/` 链接当 Maven URL）  
5. 附属方：

```gradle
repositories {
    maven { url = 'https://raw.githubusercontent.com/.../mcmodsrepo/' }
}
dependencies {
    implementation fg.deobf('group:artifact:version')
}
```

6. 若你的 jar **含 Mixin**，附属工程通常还要配置 Mixin Gradle / mixin json，否则运行期注入失败  

README 应单独一节写清：坐标、仓库 URL、是否需要 Mixin、支持的 MC 版本。

## README 建议结构

1. 模组简介 + 截图  
2. 下载徽章（CurseForge / Modrinth / GitHub）— 可用 [devins-badges](https://github.com/intergrav/devins-badges)  
3. 依赖与冲突说明  
4. **如何做附属**（Maven 段）  
5. 许可证  

多语言可用 `readme/zh_cn.md` 等；注意相对图片路径在子目录会变。

## 相关条目

- 可选依赖 / CurseMaven：`authored/cursemaven-optional-deps`  
- 崩溃分类：`authored/crash-reports`  
- 社区外链：`links/mcmod-6071-forge-engineering`（工程化；禁转载）

## 不清楚时

- 许可提炼：`permitted/mcmod-3993-forge-mod-guide`；原文 https://www.mcmod.cn/post/3993.html  
- 工程化外链：https://www.mcmod.cn/post/6071.html（禁转载，仅浏览）  
- 平台上传规则以 CurseForge / Modrinth 当前文档为准
