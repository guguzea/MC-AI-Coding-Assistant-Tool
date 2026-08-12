---
id: authored/lib-resourceful
title: Resourceful Lib 集成要点
tags: [resourceful-lib, network, codec, resourcepack, highlight, forge, fabric, neoforge]
summary: Team Resourceful 的跨平台工具库（3220 万下载，F/Forge/Neo 1.19.2-26.2）。跨平台网络、codec 工具、内存资源包、Highlight API；Resourceful Bees 与 Ad Astra 生态在用。
mcHint: 1.19.2-26.2
minecraftVersions: "1.19.2-26.2"
sourceKind: authored
modIds: [resourcefullib]
loaders: [fabric, forge, neoforge]
modrinthSlug: resourceful-lib
role: api
skillId: mc-resourceful-lib
---

# Resourceful Lib 集成要点

自写短文。Resourceful Lib 的 API 与版本细节以 [官方仓库](https://github.com/Team-Resourceful/ResourcefulLib) 当前 README 与示例为准。

## 何时用 / 何时不用

用：需要跨平台（Fabric + Forge + NeoForge，1.19.2-26.2）的通用工具，重点是四块（全览报告 §二.3）：

- **跨平台网络**：一套代码定义数据包与收发，不用每端各写一套
- **codec 工具**：序列化/反序列化的便捷封装，配合原版 Codec 体系
- **内存资源包**：运行时动态生成/注入资源（模型、语言文件、纹理），无需落盘
- **Highlight API**：世界内高亮（标记方块/区域），客户端渲染层能力

Resourceful Bees、Ad Astra 等 Team Resourceful 生态与关联模组在用，社区验证充分。

不用：

- 只想要通用注册抽象 → Architectury / Balm 更专一
- 版本低于 1.19.2（该库最早支持窗口）或 26.2 之后没有对应构建
- 只需原版已覆盖的能力（1.20.5+ 部分动态资源场景原版已可做）

## Decision Flow

```
Decision: 要不要用 Resourceful Lib
→ 版本 < 1.19.2 → 不用（窗口外），自研或换库
→ 需要 网络/codec/内存资源包/Highlight 中 ≥1 项，且目标 F/Forge/Neo → Resourceful Lib
→ 只要通用注册/事件抽象 → Architectury（lib-architectury）或 Balm（lib-balm）
→ 已选 Resourceful Lib：
   ├─ 版本：1.19.2-26.2 内与 MC 对齐（文件页为准）
   ├─ 网络：公共代码只写一次，包定义与处理器走其 API
   └─ 资源包：动态资源走内存资源包 API，别直接写 assets 目录
```

## Gradle / 声明文件检查顺序

1. `build.gradle`：官方 README 的 maven 仓库与坐标（`dev.architectury` 相关写法以 README 为准），Fabric 走 Loom `modImplementation`，Forge/Neo 走对应配置
2. 依赖方向：`resourcefullib` 的 modId 在 `mods.toml` / `neoforge.mods.toml` / `fabric.mod.json` 的 `depends`（或 `suggests`）里声明，软依赖门闩见 `authored/soft-deps-modlist`
3. 版本核对：不同 MC 版本 artifact 名可能带后缀（如 `-fabric` / `-forge` / `-neoforge`），照文件页抄，别混用
4. 若同时引 Architectury：确认 Resourceful Lib 版本与 Architectury 版本兼容（其部分构建依赖 Architectury）

## 集成要点（伪代码级）

```java
// 类名/包名以官方 README 为准，下面只是流程
// 网络：注册 payload 类型 + 编解码器 + 双端处理器，公共代码只写一份
// codec：用其 codec 工具包装你的数据类，注册进网络/存储流程
// 内存资源包：把生成好的资源（模型 JSON / lang / 纹理）挂进内存包，随模组加载注入
// Highlight：客户端侧声明要高亮的方块/位置与渲染样式，服务端只发数据
```

- 内存资源包生成的资源名仍守 modId 命名规则，别覆盖原版文件
- Highlight 是渲染层能力：服务端线程只传数据，不碰渲染对象
- 网络包注意 payload 大小与版本兼容，客户端服务端版本不一致时优雅降级

## 常见坑

- 把 codec/网络类放进公共代码却直接引用平台类 → 换端编译失败
- 动态资源路径与原版冲突 → 模型/语言文件被覆盖或加载异常
- 只 `compileOnly` 引库却硬依赖其类 → 未装时 `NoClassDefFoundError`
- 版本与 MC 不匹配（例如用 1.20.1 构建配 26.x）→ 启动崩溃
- Highlight 在服务端线程调用渲染 API → 专用服崩溃

## 自检清单

- 未装 Resourceful Lib（若软依赖）：模组正常进档，不加载其类
- 网络包双端收发正常，服务端无异常日志
- 内存资源包内容（模型/纹理/语言）在游戏内可见且无覆盖警告
- 客户端高亮显示正确，`runServer` 无渲染相关类加载

## 交叉引用

- MCP：`check_dependencies`、`generate_network_packet`、`search_community_docs`
- Skill：`mc-resourceful-lib`；相关：`mc-networking`、`mc-resourcepack`、`mc-model`
- 全览：§二.3 跨加载器抽象层；`authored/library-catalog-2026`、`authored/soft-deps-modlist`、`authored/lib-architectury`
- 官方：https://github.com/Team-Resourceful/ResourcefulLib
- 不清楚时：打开官方 README + 示例 mod（Resourceful Bees / Ad Astra 源码可参考）；AGENT_USAGE.md 规则先行
