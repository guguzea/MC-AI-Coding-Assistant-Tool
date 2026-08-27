---
name: mc-script-ui
description: 基岩版 @minecraft/server-ui 表单 UI。触发词：ActionFormData、ModalFormData、MessageFormData、server-ui
platforms: [bedrock]
mcVersions: []
communityDocId: authored/bedrock-script-api-primer
---

# @minecraft/server-ui（基岩表单）

给玩家弹出 Action / Modal / Message 表单。模块在 BP `manifest.json` 的 `dependencies` 声明 `@minecraft/server-ui`。

## Decision Flow

```
Decision: 要不要 server-ui
→ 聊天命令/物品使用后弹菜单 → 用本模块
→ 世界 UI / HUD 血条 → 不是本模块（RP JSON / 客户端绑定）
→ 未点名 Beta → 只用 stable 版本号（对照 Learn / docsStatus）
```

## 官方文档

- 用 `search_bedrock_docs` 查 `@minecraft/server-ui`；不要用 Java Screen/Menu 教程冒充。

## 常见错误

- 在服务端 Script 里假设有浏览器 DOM
- 把 Forge/Fabric Screen 类名抄进基岩
