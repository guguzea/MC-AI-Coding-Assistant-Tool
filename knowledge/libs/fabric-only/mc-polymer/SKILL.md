---
name: mc-polymer
description: Polymer 纯服务端内容库。触发词：Polymer、虚拟方块、virtual block、纯服务端、AutoHost、server-side content、Patbox
platforms: [fabric, quilt]
mcVersions: ["1.18-26.2"]
communityDocId: authored/lib-polymer
mappings: hint
---

# Polymer（Fabric/Quilt，纯服务端内容）

服务端注册虚拟方块/物品/实体，原版客户端免装 mod 即可见；AutoHost 把自定义模型/纹理托管到服务器 HTTP 端口。适合定制服与"客户端零 mod"分发。无 Forge/Neo 版。

## Decision Flow

```
Decision: 用不用 Polymer
→ platform = forge / neoforge → 本 skill 不适用（无对应构建）
→ 内容需要客户端本地渲染/资源包定制 → 传统双端 mod 分发
→ 只想改服务端数据（配方/tag）→ KubeJS 或数据包更轻（mc-kubejs）
→ 目标是"原版客户端免装可见"的服务端内容 → Polymer
→ 已选：
   ├─ 版本：1.18-26.2 内与 MC 对齐（GitHub Releases / Modrinth 文件页）
   ├─ 内容形态：虚拟方块/物品/实体按 Polymer API 注册，客户端以合适原版组件显示
   ├─ AutoHost：需要自定义模型/纹理时开启，资源走服务器 HTTP 端口下发
   └─ 命名空间：注册 id 遵守原版规则，避免与既有内容冲突
```

## 软/硬依赖

- maven 仓库与 `modImplementation` 坐标照官方 README（Fabric Loom 流程）
- `fabric.mod.json`：`depends` / `suggests` 写 polymer（软依赖门闩见 `authored/soft-deps-modlist`）
- 类加载隔离：注册逻辑全在服务端，客户端不需要 Polymer 类引用；虚拟内容行为由服务端驱动，客户端只显示

## 官方文档

- 仓库：https://github.com/Patbox/polymer （README + 示例 mod）

## communityDocId 引用

- `authored/lib-polymer`：完整要点（何时用/不用、集成流程、自检清单），经 MCP `search_community_docs` 读取

## 常见错误

- 无 AutoHost 时用自定义模型/纹理：客户端显示占位/异常
- 注册 id 冲突：虚拟内容串台
- 把 Polymer 当普通内容 mod 双端安装：它是服务端定位，安装方式以 README 为准
- 照抄 1.18 时代旧教程类名/包名：跨度大已重构，以当前 README 为准

## 自检

- 原版客户端能进服并看见服务端内容；服务端日志无 Polymer 报错
- AutoHost（若启用）模型/纹理可访问；目标版本能拉到对应构建

未核对签名不写死：注册 API 与入口以官方 README + 示例为准。
