---
id: authored/lib-playeranimator
title: playerAnimator 玩家动画库集成要点
tags: [playeranimator, animation, keyframe, player, renderer, bendy-lib, fabric, forge, neoforge, quilt]
summary: 玩家关键帧动画库（2480 万下载；F/Forge/Neo/Quilt，1.16.4-1.21.7），第一/第三人称玩家动画，配套 bendy-lib 弯曲增强，战斗模组（Better Combat、Iron's Spells 等）常见。
mcHint: 1.16.4-1.21.7
minecraftVersions: "1.16.4-1.21.7"
sourceKind: authored
modIds: [player-animator]
loaders: [fabric, forge, neoforge, quilt]
modrinthSlug: playeranimator
role: api
skillId: mc-playeranimator
---

# playerAnimator 玩家动画库集成要点

自写短文。版本与 API 细节以 [playerAnimator](https://github.com/KosmX/playerAnimator) 当前 README 与示例 mod 为准。

## 何时用 / 何时不用

用：要给玩家（第一人称/第三人称）加关键帧动画，比如攻击、施法、持握姿态，目标为 F/Forge/Neo/Quilt 且 MC 在 1.16.4-1.21.7。Modrinth 2480 万下载，Better Combat、Iron's Spells & Spellbooks 等战斗模组大量采用。需要弯曲（bend）增强时配 bendy-lib。

不用：目标 MC 高于 1.21.7（26.x）时先查官方是否有新版构建，全览窗口未覆盖；动画主体不是玩家（是实体/生物）时选 GeckoLib；只需要简单的渲染变换（如持握偏移）时原版 `ItemDisplayContext` 等机制可能就够。

## Decision Flow

```
Decision: 要不要用 playerAnimator
→ 动画对象不是玩家 → GeckoLib（3D 骨骼动画，1.12.2-26.2）
→ 目标 MC 不在 1.16.4-1.21.7 → 查官方仓库最新支持版本后再定
→ 玩家关键帧动画（攻击/施法/姿态）→ playerAnimator
→ 需要弯曲增强 → 同时引 bendy-lib（以官方说明为准）
→ 已选：
   ├─ 版本：与 MC 对齐（Modrinth / CurseForge 文件页）
   ├─ 加载器：F/Forge/Neo/Quilt 按目标端选 artifact
   └─ 客户端渲染侧注册，服务端只同步状态（如有）
```

## Gradle / 声明文件检查顺序

1. `build.gradle`：官方 README 的仓库与坐标（不同加载器 artifact 不同），`compileOnly` + 开发 `runtimeOnly`
2. `mods.toml`（26.x 为 `neoforge.mods.toml`）：`depends` 写 `player-animator`（modId 以官方 jar 为准）；软依赖用 `ModList.get().isLoaded(...)` 门闩（见 `authored/soft-deps-modlist`）
3. `fabric.mod.json`：`depends` / `suggests`
4. 版本核对：1.21.7 上界以文件页为准，26.x 需求先确认有无构建

## 集成要点（伪代码级）

```java
// 类名/注解以官方为准：playerAnimator 提供玩家动画注册与关键帧 API
// 典型流程：定义动画（关键帧 + 时长 + 缓动）→ 注册到玩家动画系统 → 在代码中触发/播放
// 渲染：客户端侧挂接渲染回调，把姿态应用到玩家模型
// 多玩家：动画状态是客户端表现，服务端只负责触发时机（网络包同步）
```

- 动画定义建议用 Blockbench 之类工具做关键帧，导出的数据按官方格式接入
- bendy-lib 是独立增强，按官方 README 单独引入

## 常见坑

- 目标 26.x 却照 1.21.7 教程写 → 先确认官方是否有对应版本，没有就换方案
- 渲染回调放服务端/公共代码 → 专用服或逻辑服崩溃（客户端门闩）
- 动画触发只发客户端 → 多人下其他玩家看不到（用网络包同步触发）
- 依赖声明与实际 modId 不一致（`player-animator` vs 显示名）→ 运行时找不到库

## 自检清单

- 单人：动画在第三人称与第一人称视角都正常播放
- 多人：其他玩家视角也能看到动画（同步生效）
- `runServer` 不加载渲染侧类
- 目标 MC 版本的构建存在且依赖解析通过

## 交叉引用

- MCP：`generate_entity_renderer`、`check_dependencies`、`search_community_docs`
- Skill：`mc-playeranimator`；相关：`mc-renderer`、`mc-geckolib`、`mc-networking`
- 全览：§二.2 动画库、§四 平台推荐路线；`authored/library-catalog-2026`、`authored/lib-geckolib`、`authored/library-integration`、`authored/soft-deps-modlist`
- 官方：https://github.com/KosmX/playerAnimator
- 不清楚时：打开 playerAnimator README + 示例 mod，或 `search_fabric_docs` / `search_forge_docs`；AGENT_USAGE.md 规则先行
