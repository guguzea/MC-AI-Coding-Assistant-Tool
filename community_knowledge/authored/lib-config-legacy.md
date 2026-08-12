---
id: authored/lib-config-legacy
title: 历史配置库（Auto Config / Fiber / Omega / Oro / Tweed / Simple）识别与迁移
tags: [auto-config, fiber, omega-config, oro-config, tweed, simple-config, config, legacy, fabric]
summary: 旧 Fabric 生态配置库（Auto Config / Fiber / Omega Config / Oro Config / Tweed / Simple Config）少用：多数停更或生态萎缩，新项目迁移到 YACL / Cloth / Fzzy。全览未逐一列版本与加载器，以各库官方为准。
mcHint: 以各库官方为准
minecraftVersions: ""
sourceKind: authored
modIds: []
loaders: [fabric]
modrinthSlug: ""
role: api
skillId: mc-config
---

# 历史配置库识别与迁移要点

自写短文。本条目是「少用清单」，不是 API 指南：全览报告仅列出名称（源自 Fabric Wiki 中文社区库列表），未收录各库下载量、版本窗口与加载器，**modIds 不确定填 []，具体数据一律以各库官方页面为准**。

## 何时用 / 何时不用

用：仅在维护既有模组、需要读懂旧代码里的配置写法时，识别这些库（Auto Config / Fiber / Omega Config / Oro Config / Tweed / Simple Config）的 API 形态。它们多数已停更或生态萎缩。

不用：新项目一律不选。配置需求请用活跃库：YACL（1.19-26.3）、Cloth（1.14-26.2，已冷冻但仍有构建）、Fzzy Config（1.20.1-26.2，自动 GUI/校验/同步）。

## Decision Flow

```
Decision: 遇到历史配置库怎么办
→ 新项目 → 不选；按版本选 YACL / Cloth / Fzzy（见各 lib-* 短文）
→ 旧项目维护，代码里出现这些库 → 按原库 API 改，别混入新库写法
→ 旧项目想迁移 → 迁移到 YACL / Cloth / Fzzy：
   ├─ 把配置数据导出为迁移后格式（新库接管读写路径）
   ├─ 删除旧库依赖与初始化代码
   └─ GUI 入口换成新库方案（Mod Menu 等）
→ 数据/API 细节不清楚 → 打开该库官方页面，禁止凭记忆
```

## Gradle / 声明文件检查顺序

1. `build.gradle`：识别旧库坐标（各库 maven 不同，以官方为准）；迁移后删除
2. `fabric.mod.json`：移除对应 `depends` / `suggests`（多数为 Fabric 生态库，加载器以各库官方为准）
3. 迁移目标库的声明：按对应 `lib-yacl` / `lib-cloth-config` / `lib-fzzy-config` 短文检查
4. 版本核对：旧库若仍在某 MC 版本有构建，也只按需使用

## 集成要点（伪代码级）

```java
// 旧库 API 形态各异（注解式 / Builder 式都有），类名以各库官方为准
// 维护旧代码：只改业务逻辑，不重写配置段，避免引入新库依赖
// 迁移：配置对象 → 新库对应定义 → 删除旧初始化 → 客户端门闩换新 GUI 入口
```

- 迁移时先备份原配置文件（路径与格式都会变）
- 新库接管后，旧配置文件路径不再被读取，通知用户

## 常见坑

- 新项目误用旧库 → 停更风险、生态不兼容
- 凭记忆写旧库 API → 方法名/注解早已变动，必须查官方
- 迁移时新旧两套配置并存 → 双份读写冲突（只留一套）
- 忽略版本窗口 → 目标 MC 版本可能没有对应构建

## 自检清单

- 新项目无任何历史配置库依赖
- 迁移后只存在一个配置读写路径，旧文件被清理或忽略
- 配置屏（新库）能打开且数据与迁移前一致
- `check_dependencies` 无残留旧库版本冲突

## 交叉引用

- MCP：`generate_config`、`check_dependencies`、`search_community_docs`
- Skill：`mc-config`
- 全览：§二.1 配置库（历史配置库段）；`authored/library-catalog-2026`、`authored/lib-cloth-config`、`authored/lib-yacl`、`authored/lib-fzzy-config`、`authored/library-integration`
- 官方：各库页面以全览所指 Fabric Wiki 中文社区库列表为入口；活跃替代：https://github.com/isxander/yet-another-config-lib 、https://github.com/shedaniel/cloth-config 、https://github.com/fzzyhmstrs/fzzy_config
- 不清楚时：先打开对应库官方页面；AGENT_USAGE.md 规则先行（本条目数据不完整，禁止补造）
