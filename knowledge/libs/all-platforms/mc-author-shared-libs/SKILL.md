---
name: mc-author-shared-libs
description: 作者全家桶共享库依赖树纪律。触发词：Collective、Puzzles Lib、Bookshelf、MaLiLib、Kiwi、Sophisticated Core、CorgiLib、Necronomicon、LibZ、Mantle、LibX、Placebo、Iceberg、GlitchCore、CreativeCore、全家桶、共享库、依赖树、为什么多了个库
platforms: [fabric, forge, neoforge]
mcVersions: ["1.20.1+"]
communityDocId: authored/library-integration
---

# 全家桶共享库：依赖树纪律

Serilum（Collective）、Fuzs（Puzzles Lib）、Darkhax（Bookshelf）、masa（MaLiLib）等作者的"全家桶"库，是作者为自己的模组共享代码用的。整合包依赖它们，不等于它们是对第三方开放的稳定公共 API。

## Decision: 遇到全家桶库时怎么处理

```
IF 该库只是整合包依赖树里的传递依赖，你的模组不调用它
  → 不要声明任何依赖，也不要写集成代码
IF 想调用该库的类
  → 先查官方仓库 README 是否承诺公共 API（多数没有）
     → 没有承诺 → 改用原版 / 官方 API 或自实现，不要硬依赖
     → 有承诺 → compileOnly + isLoaded 门闩，按软依赖接入
IF 你是该作者生态内的模组（跟随 Fuzs / Serilum 体系）
  → 跟随生态声明，版本跟随作者发布
```

## 软 / 硬依赖要点

- 全家桶库在依赖树中通常是**传递依赖**（因为作者的其它模组需要），不是你的模组需要
- 第三方模组把全家桶库写进 mods.toml mandatory / fabric.mod.json depends = 常见过度声明
- 确实要用：`compileOnly` + 运行时 `isLoaded` 门闩（见 `authored/soft-deps-modlist`），别在主类 static 字段直接 import
- 版本锁定跟随作者发布窗口，别期待库为新版本滚动跟进

## 重名与版本陷阱

- **Bookshelf 重名**：Modrinth 的 `bookshelf` 是 Spigot 插件，Darkhax 的库是 `bookshelf-lib`（坐标别选错）
- Mantle（SlimeKnights）：1.21+ / 26.x 无新版本，旧生态
- LibZ：仅 Fabric
- MaLiLib：客户端专用，服务端引用会崩

## 官方文档

- Collective / Puzzles Lib / Bookshelf 等：各作者 GitHub 仓库 README（无统一 API 文档站）
- 以仓库当前 README 为准，未核对不写死方法签名

## 常见错误

- 把 Collective 当通用工具 API 硬依赖（它不是）
- Bookshelf 坐标选成 Spigot 插件的 `bookshelf`，编译出莫名依赖
- 把传递依赖写进自己的 mandatory 声明，玩家缺库直接进不了游戏
- 期待 Mantle 等老库支持 26.x 新版本
- 只 compileOnly 却不加 isLoaded 门闩 → 未装时 NoClassDefFoundError

## 相关

- 短文：`authored/library-integration`（总清单）、`authored/library-catalog-2026`（全家桶列表与重名陷阱）、`authored/lib-traps-2026`
- MCP：`check_dependencies`（依赖树检查）、`search_community_docs`
- 官方入口：各库 GitHub（见 catalog 短文链接）
