---
name: mc-kubejs
description: KubeJS 整合包脚本引擎。JS 脚本改配方/注册物品方块/改 tag/热重载，开发期配 ProbeJS。触发词：KubeJS、kubejs、脚本、javascript、recipe 脚本、ProbeJS、整合包
platforms: [fabric, forge, neoforge]
mcVersions: ["1.18.2-26.1.2"]
communityDocId: authored/lib-kubejs
mappings: "脚本层 API 由 KubeJS 封装，与项目 mappings 无关；类名以 docs.kubejs.com 对应版本为准"
---

# KubeJS 整合包脚本（操作指引）

给 AI 的操作指引：用 JS 脚本做整合包内容定制（配方/tag/简单注册/自定义逻辑），免编译免重启。详细信息用 `search_community_docs` 查 `authored/lib-kubejs`，API 细节以 [官方文档 docs.kubejs.com](https://docs.kubejs.com)（对应 MC 版本）与 [官方仓库](https://github.com/KubeJS-Mods/KubeJS) 为准。

## 何时用 / 何时不用

- 用：整合包内容调整（改/删配方、注册简单物品方块、改 tag、写脚本逻辑）；ATM/E2E 等大型整合包依赖它
- 不用：需要自定义渲染、深度注册或性能关键逻辑 → 写 Java 模组（KubeJS 是脚本层不是替代品）；正式产品级内容分发 → Java 模组 + 数据包更可控；只想改配方/tag 且无脚本需求 → 数据包可能就够

## Decision Flow

```
Decision: 用不用 KubeJS
→ 需要自定义渲染/复杂注册/性能关键逻辑 → Java mod（mc-registry / mc-renderer）
→ 整合包内容调整（配方/tag/简单注册/脚本逻辑）→ KubeJS
→ 已选：
   ├─ 平台分支：fabric / forge / neoforge 各装对应构建（Quilt 另有构建，按短文 loaders）
   ├─ 脚本位置：按平台约定放 scripts 目录（startup / server / client 分场景，以文档为准）
   ├─ 热重载：改脚本后可热重载，生产环境注意边界（以文档为准）
   ├─ ProbeJS：开发期启用，提供补全与文档（可选依赖）
   └─ 版本：1.18.2-26.1.2 内与 MC 对齐（GitHub Releases / Modrinth 文件页）
```

## 操作步骤

1. 玩家侧：整合包直接装 KubeJS，无需 gradle；作为依赖（你的 mod 调 KubeJS API）才配 `build.gradle`（照官方文档的 maven 与坐标）
2. 声明依赖：`fabric.mod.json` / `mods.toml`（26.x 为 `neoforge.mods.toml`）的 `depends` / `suggests` 写 `kubejs`；软依赖门闩见 `authored/soft-deps-modlist`
3. 分场景写脚本：startup 脚本注册简单物品/方块（id、属性以文档 API 为准）；server 脚本监听配方/标签相关事件改配方与 tag；客户端逻辑放 client 场景
4. 热重载验证：改完脚本按文档方式触发重载，验证改动生效且无残留状态
5. 版本对齐：脚本 API 随 MC 版本大改，事件名、脚本目录与 API 名称以 docs.kubejs.com 对应版本为准，勿照抄旧版本脚本

## 软 / 硬依赖

- 玩家侧使用是「前置依赖」：整合包必须装 KubeJS 本体
- 作为开发依赖：可 `compileOnly` + 门闩（软）或 `depends`（硬）；未装时不能加载引用 KubeJS 类的代码
- ProbeJS 是开发期可选依赖，与 KubeJS 版本需匹配

## 常见错误

- 脚本 API 随 MC 版本大改 → 旧脚本失效，先查 docs.kubejs.com 对应版本
- 配方改不动 → 事件名或配方 id 写错，先确认事件与目标配方 id
- 期待「脚本即全功能 mod」→ 渲染/复杂注册仍需 Java 模组
- 平台间脚本目录/加载行为有差异 → 换平台时核对文档
- 生产服依赖热重载改内容 → 注意热重载与正式环境的边界

## 自检清单

- 目标脚本在日志中加载无报错，改动生效（配方/tag/注册验证）
- 热重载后改动立即生效且无残留状态
- 与 ProbeJS（若用）配合能出补全，无版本不匹配告警
- 目标 MC 版本能拉到对应 KubeJS 构建

## 参考

- 官方：https://github.com/KubeJS-Mods/KubeJS 、https://docs.kubejs.com
- 社区：`search_community_docs` → `authored/lib-kubejs`
- 相关 Skill：`mc-recipe`、`mc-registry`、`mc-datapack`
- 不确定时：打开 docs.kubejs.com（对应 MC 版本）+ 官方示例，未核对前不写死任何 API
