---
name: mc-text-placeholder
description: Text Placeholder API 占位符。触发词：占位符、placeholder、%modid:key%、Text Placeholder API、Simplified Text Format、Patbox
platforms: [fabric, quilt]
mcVersions: ["1.17-26.2"]
communityDocId: authored/lib-text-placeholder-api
mappings: hint
---

# Text Placeholder API（Fabric/Quilt）

注册与消费 `%modid:type%` 占位符（1.17-26.2），配合 Simplified Text Format 简化文本构建。适用聊天、名牌、命令输出、GUI 与数据驱动文本。无 Forge/Neo 版。

## Decision Flow

```
Decision: 用不用 Text Placeholder API
→ platform = forge / neoforge → 本 skill 不适用（无对应构建）
→ 文本固定、无需运行时替换 → 原版 Component / translatable 就够
→ 只需要语言文件本地化 → 读 authored/localization-lang
→ 要暴露/消费 %modid:type% 占位符 → Text Placeholder API
→ 已选：
   ├─ 格式：%modid:key%，modid 用自己模组 id，避免冲突
   ├─ 解析：把含占位符的文本交给库解析，不要在客户端硬拆字符串
   ├─ Simplified Text Format：简写语法构建 Component（语法以 README 为准）
   └─ 版本：1.17-26.2 内与 MC 对齐
```

## 软/硬依赖

- maven 仓库与 `modImplementation` 坐标照官方 README（Fabric Loom 流程）
- `fabric.mod.json`：`depends` / `suggests` 写 text_placeholder_api（软依赖门闩见 `authored/soft-deps-modlist`）
- 注册与解析在服务端逻辑内，客户端渲染交给原版文本管线
- 占位符 key 命名稳定，改 key 前确认无外部依赖

## 官方文档

- 仓库：https://github.com/Patbox/TextPlaceholderAPI （README + 示例）

## communityDocId 引用

- `authored/lib-text-placeholder-api`：完整要点，经 MCP `search_community_docs` 读取

## 常见错误

- 占位符 key 与其他 mod 冲突：命名加自己 modId 前缀
- 把 %modid:key% 当纯文本直接显示：忘了调用库的解析入口
- 期待服务端命令输出自动替换：必须显式调用解析 API，不会隐式生效
- 照抄 1.17 时代旧教程类名：已重构，以当前 README 为准

## 自检

- 含占位符文本被正确替换（聊天/命令输出验证）；未装库时模组不加载相关类
- runServer 日志无解析异常；目标版本能拉到对应构建

未核对签名不写死：解析入口/注册 API 以官方 README + 示例为准。
