---
name: mc-satin
description: Satin 后期处理着色器。触发词：Satin、shader、后期处理、post-processing、全屏滤镜、Ladysnake
platforms: [fabric, quilt]
mcVersions: ["1.18-1.21.4"]
communityDocId: authored/lib-satin
mappings: hint
---

# Satin（Fabric 后期处理着色器）

封装原版后期处理管线为易用 API，做全屏 shader 效果（滤镜、扭曲、调色）。仅 Fabric（1.18-1.21.4），Quilt 兼容以官方为准。Forge/Neo 无构建。

## Decision Flow

```
Decision: 要不要用 Satin
→ platform = forge / neoforge → 本 skill 不适用（无 artifact），换对应平台方案
→ 目标 MC 不在 1.18-1.21.4 → 查官方仓库最新支持版本后再定
→ Fabric + 全屏后期处理效果 → Satin
→ 只做局部材质/方块 shader → 原版 RenderType / material 路径，不必引 Satin
→ 已选：
   ├─ 版本：与 MC 对齐（Modrinth 文件页）
   ├─ 加载器：仅 fabric
   └─ 客户端渲染侧注册，服务端不涉及
```

## 软/硬依赖

- 官方 README 仓库与坐标（Loom 环境），建议 `compileOnly` + 开发期 `runtimeOnly`
- `fabric.mod.json`：`depends` / `suggests` 写 satin（modId 以官方 jar 为准）
- 类加载隔离：入口与状态放 client 包，公共代码只留门闩；服务端引用渲染类会崩溃
- shader 资源放正确路径，命名与注册名对应

## 官方文档

- 仓库：https://github.com/Ladysnake/Satin （README）

## communityDocId 引用

- `authored/lib-satin`：完整要点（效果注册流程、自检清单），经 MCP `search_community_docs` 读取

## 常见错误

- 非 Fabric 项目引入：无 artifact，构建失败
- shader 资源路径或 uniform 名写错：静默无效果或日志报错
- 渲染入口被公共/服务端代码引用：专用服崩溃
- 期待 1.21.4 以上支持：以官方发布为准，勿假定滚动跟进

## 自检

- 仅装 Fabric + 你的模组：效果正常触发与关闭
- 软依赖时未装 Satin 能进档；runServer 无 shader 类加载；日志无编译错误

未核对签名不写死：注册入口/API 以官方 README + 示例为准。
