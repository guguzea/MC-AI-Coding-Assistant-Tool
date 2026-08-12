---
name: mc-playeranimator
description: playerAnimator 玩家关键帧动画。给玩家加攻击/施法/持握姿态动画，bendy-lib 弯曲增强。触发词：playerAnimator、player-animator、关键帧、玩家动画、bendy、keyframe、animation
platforms: [fabric, forge, neoforge]
mcVersions: ["1.16.4-1.21.7"]
communityDocId: authored/lib-playeranimator
mappings: "库按各 loader 预重映射；公共代码不直接引用渲染类，映射差异由库隔离"
---

# playerAnimator 玩家动画（操作指引）

给 AI 的操作指引：为玩家（第一/第三人称）加关键帧动画，如攻击、施法、持握姿态。详细信息用 `search_community_docs` 查 `authored/lib-playeranimator`，API 细节以 [官方仓库](https://github.com/KosmX/playerAnimator) 当前 README 与示例 mod 为准。

## 何时用 / 何时不用

- 用：动画对象是玩家；目标 MC 在 1.16.4-1.21.7 窗口内；战斗类玩法（Better Combat、Iron's Spells 等大量采用）
- 不用：动画对象是实体/生物 → 选 GeckoLib（3D 骨骼动画）；目标 26.x → 先查官方是否有新版构建再定；只要简单持握偏移 → 原版 `ItemDisplayContext` 等机制可能就够

## Decision Flow

```
Decision: 玩家动画方案
→ 动画对象不是玩家 → GeckoLib（mc-geckolib）
→ 目标 MC 不在 1.16.4-1.21.7 → 查官方仓库最新支持版本后再定，别硬写
→ 玩家关键帧动画（攻击/施法/姿态）→ playerAnimator
→ 需要弯曲增强 → 同时引 bendy-lib（以官方说明为准）
→ 已选：
   ├─ 平台分支：fabric / forge / neoforge 各装对应 artifact（Quilt 另有构建，按短文 loaders）
   ├─ 渲染：客户端渲染侧注册，服务端只同步触发状态
   └─ 版本：与 MC 对齐（Modrinth / CurseForge 文件页）
```

## 操作步骤

1. 依赖声明：`build.gradle` 照官方 README 配仓库与坐标（各 loader artifact 不同）；开发期 `compileOnly` + `runtimeOnly`，正式依赖或软依赖门闩见 `authored/soft-deps-modlist`
2. 声明依赖：`mods.toml`（26.x 为 `neoforge.mods.toml`）/ `fabric.mod.json` 的 `depends` 写 `player-animator`（**注意 modId 带连字符**，与显示名不同）；软依赖用 `ModList.get().isLoaded(...)` 门闩
3. 定义动画：用 Blockbench 之类工具做关键帧（关键帧 + 时长 + 缓动），按官方格式接入
4. 注册与触发：注册到玩家动画系统，在代码中触发/播放；动画状态是客户端表现，服务端只负责触发时机
5. 多人同步：触发时机用网络包同步，否则其他玩家看不到动画（参见 `mc-networking`）
6. 渲染隔离：所有渲染回调放客户端专用代码，服务端/公共代码不得引用渲染侧类

## 软 / 硬依赖

- 硬依赖：运行时必须有 player-animator；只 `compileOnly` 却当硬依赖用 → `NoClassDefFoundError`
- bendy-lib 是独立增强，按官方 README 单独引入，不是 playerAnimator 自带

## 常见错误

- 目标 26.x 却照 1.21.7 教程写 → 先确认官方是否有对应版本，没有就换方案
- 渲染回调放服务端/公共代码 → 专用服或逻辑服崩溃（必须客户端门闩）
- 动画触发只发客户端 → 多人下其他玩家看不到（用网络包同步）
- 依赖声明 modId 写错（`player-animator` vs 显示名）→ 运行时找不到库

## 自检清单

- 单人：第三人称与第一人称视角动画都正常
- 多人：其他玩家视角能看到动画
- `runServer` 不加载渲染侧类
- 目标 MC 版本的构建存在且依赖解析通过

## 参考

- 官方：https://github.com/KosmX/playerAnimator
- 社区：`search_community_docs` → `authored/lib-playeranimator`
- 相关 Skill：`mc-renderer`、`mc-geckolib`、`mc-networking`
- 不确定时：打开 playerAnimator README + 示例 mod，未核对前不写死任何类名/方法签名
