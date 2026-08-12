---
name: mc-resourceful-lib
description: Resourceful Lib 跨平台工具库（Team Resourceful），跨平台网络、codec 工具、内存资源包、Highlight API。触发词：Resourceful Lib、resourcefullib、Team Resourceful、Resourceful Bees、Ad Astra、内存资源包、Highlight
platforms: [fabric, forge, neoforge]
mcVersions: ["1.19.2-26.2"]
communityDocId: authored/lib-resourceful
---

# Resourceful Lib 集成（操作指引）

给 AI 的操作指引：需要跨平台（Fabric + Forge + NeoForge，1.19.2-26.2）的通用工具时，用 Resourceful Lib 覆盖跨平台网络、codec 工具、内存资源包与 Highlight API 四块能力。详细信息用 `search_community_docs` 查 `authored/lib-resourceful`，API 细节以 [官方仓库](https://github.com/Team-Resourceful/ResourcefulLib) 当前 README 与示例为准。

## 定位

- 能力：**跨平台网络**（一套代码定义数据包与收发）、**codec 工具**（序列化/反序列化封装，配合原版 Codec 体系）、**内存资源包**（运行时动态生成/注入模型、语言文件、纹理，无需落盘）、**Highlight API**（世界内高亮标记方块/区域，客户端渲染层能力）
- 生态：Team Resourceful 出品，Resourceful Bees、Ad Astra 等生态与关联模组在用，社区验证充分（3220 万下载）
- 版本 / loader 边界：F/Forge/Neo，支持窗口 **1.19.2-26.2**；低于 1.19.2 无构建，26.2 之后没有对应构建；部分构建依赖 Architectury，需核对兼容

## Decision Flow

```
Decision: 要不要用 Resourceful Lib
→ 版本 < 1.19.2 或 > 26.2 → 不用（窗口外），自研或换库
→ 需要 网络/codec/内存资源包/Highlight 中 ≥1 项，且目标 F/Forge/Neo → Resourceful Lib
→ 只要通用注册/事件抽象 → Architectury（见 mc-architectury）或 Balm（见 mc-balm）更专一
→ 已选 Resourceful Lib：
   ├─ 版本：1.19.2-26.2 内与 MC 对齐（文件页为准，artifact 可能带 -fabric / -forge / -neoforge 后缀，别混用）
   ├─ 网络：公共代码只写一次，包定义与处理器走其 API
   ├─ 资源包：动态资源走内存资源包 API，别直接写 assets 目录
   └─ 同时引 Architectury → 先核对两者版本兼容
```

## 接入检查顺序

1. `build.gradle`：官方 README 的 maven 仓库与坐标；Fabric 走 Loom `modImplementation`，Forge/Neo 走对应配置
2. `fabric.mod.json` / `mods.toml` / `neoforge.mods.toml`：`depends`（或 `suggests`）写 `resourcefullib`；软依赖门闩见 `authored/soft-deps-modlist`
3. 版本核对：不同 MC 版本 artifact 名可能带端后缀，照文件页抄

## 核心 API 速查

类名/包名以官方 README 为准（核对记录：1.19.2/fabric 顶层包 `com.teamresourceful.resourcefullib`），下面只列能力与流程：

- **跨平台网络**：注册 payload 类型 + 编解码器 + 双端处理器，公共代码只写一份；注意 payload 大小与版本兼容，双端版本不一致时优雅降级
- **codec 工具**：用其 codec 工具包装数据类，注册进网络/存储流程
- **内存资源包**：把生成好的资源（模型 JSON / lang / 纹理）挂进内存包，随模组加载注入；资源名守 modId 命名规则，别覆盖原版文件
- **Highlight API**：客户端侧声明要高亮的方块/位置与渲染样式，服务端只发数据；渲染层能力，服务端线程不碰渲染对象

## 常见错误

- 把 codec/网络类放进公共代码却直接引用平台类 → 换端编译失败
- 动态资源路径与原版冲突 → 模型/语言文件被覆盖或加载异常
- 只 `compileOnly` 引库却硬依赖其类 → 未装时 `NoClassDefFoundError`
- 版本与 MC 不匹配（例如 1.20.1 构建配 26.x）→ 启动崩溃
- Highlight 在服务端线程调用渲染 API → 专用服崩溃

## 参考

- 官方：https://github.com/Team-Resourceful/ResourcefulLib
- 社区：`search_community_docs` → `authored/lib-resourceful`；相关：`authored/lib-architectury`、`authored/soft-deps-modlist`
- 相关 Skill：`mc-networking`、`mc-resourcepack`、`mc-model`、`mc-architectury`
- 不确定时：打开官方 README + 示例 mod（Resourceful Bees / Ad Astra 源码可参考），未核对前不写死任何类名/方法签名
