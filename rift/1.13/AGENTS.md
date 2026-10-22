# Rift 1.13 — Agent 总纲

短命加载器，**原生线唯一的目标版本就是 1.13**。方法名**只许**来自 `knowledge/common/` 与已核实构件；**禁止**用 Fabric `ModInitializer` / `onInitialize` 记忆填写。

- 元数据官方拼写：**`riftmod.json`**（兼容误写 `rift.mod.json`）
- **版本事实（可现算，不是推断）**：上游 `DimensionalDevelopment/Rift` **archived**（最后提交 2019-01-01，**MIT**）；最终原生件 `1.0.4-106`，jar 内 `profile.json` 的 `inheritsFrom` = **`1.13`**（由 `extract-rift-api-surface.mjs` 现读，见 `knowledge/common/verified-api.md` §1 与「构件的版本自述」段）
- **1.13.1 / 1.13.2 没有原生件**：只有 Chocohead 的社区分支 `newerer`（自标 1.13.1）/ `newerest`（自标 1.13.2），JitPack 未取到成品 ⇒ 本档是**唯一「件与 MC 对齐」**的档
- Gradle：`apply plugin: 'net.minecraftforge.gradle.tweaker-client'`（DimensionalDevelopment 的 ForgeGradle fork，坐标 `com.github.DimensionalDevelopment:ForgeGradle:70d441a286`）
- Java 8；`tweakClass = 'org.dimdev.riftloader.launch.RiftLoaderClientTweaker'`
- `libs/` **只放一件**（同 id 两件 = `DuplicateModException: Duplicate mod rift`），且必须是**非 dev**：`rift-1.0.4-106.jar`（140 331 B / sha256 `D6A60EBC…`）
- `minecraft { version = '1.13'; mappings = 'snapshot_20180921' }` —— 该 snapshot 上游只发 `-1.13` 后缀，本档正好对上，**不需要**手工丢 zip
- `search_docs({platform:"rift"})` **不要**回退 Fabric 文档树
- `port_project` 对 Rift 默认 dryRun；rift→fabric 只出笔记

已核实 Listener 方法见 `knowledge/common/listeners.md`；签名表见 `knowledge/common/verified-api.md`。

## 本档已有的真机证据（2026-10-23）

在 MC **1.13** 上实跑（手工链路，非 Gradle `runClient`）拿到：

```
Calling tweak class org.dimdev.riftloader.launch.RiftLoaderClientTweaker
Loaded mod 'qaprobe'
Loading Rift!
[QA] registerBlocks
[QA] afterVanillaBootstrap
```

⇒ **listener 真的被回调**（这正是 `rift/1.13.2` 档做不到的：那档 21 个 hook mixin target not found、探针 0 命中）。
之后崩在 `lwjgl.dll`（缺 natives，GL 阶段）—— **在 listener 之后**，不影响该结论。

**没覆盖的**：进主菜单/进世界、`clientTick` 每 tick 回调、Gradle 构建链、1.13.2 的对照复跑。四项都写在 `pack.meta.json` 的 `scaffold.runtimeProbe.notCovered` 里，别把它读成「全绿」。

## 本档与 rift/1.13.2 的分工（**别混读**）

| | 本档 `rift/1.13` | `rift/1.13.2` |
|---|---|---|
| 定位 | 原生档，件与 MC 对齐 | **社区分支实验档** |
| 件 | `1.0.4-106`（`inheritsFrom=1.13`） | 同一件（也是 1.13 的件）|
| 已知实测 | 见 `pack.meta.json` 的 `provenance.build` | 能启动，但 21 个 hook mixin target not found ⇒ **listener 不派发** |

⇒ 两档**不得互相复制结论**。1.13.2 档里任何「实测可用」的说法都不适用于本档，反之亦然。

## 本档暂无 skill 面

`.cursor/skills/` **有意留空**：1.13.2 档的 `mc-events` / `mc-gui` / `mc-networking` 是针对该档写的，直接搬过来就是「把没验证过的东西当本档结论」。需要时按 `knowledge/common/` 的事实重写，不要复制。
