# Rift 1.13 的 Gradle 配方

## 1. 三件必须对上的东西

| 项 | 值 | 为什么 |
|---|---|---|
| Rift 件 | `libs/rift-1.0.4-106.jar`（**非 dev**） | dev 件缺 `mixins.rift.refmap.json` ⇒ `InvalidMixinException: No refMap loaded` |
| `minecraft.version` | `'1.13'` | 件内 `profile.json` 的 `inheritsFrom` = `1.13`；`libs/README.md` 记「用本件的真法就是把 version 改成 1.13」 |
| `mappings` | `'snapshot_20180921'` | 上游只发 `mcp_snapshot-20180921-1.13`，本档正好命中 |

## 2. ForgeGradle 只能是那个 fork

```groovy
buildscript {
    repositories { maven { url = 'https://jitpack.io' }; maven { url = 'https://maven.minecraftforge.net/' }; mavenCentral() }
    dependencies { classpath 'com.github.DimensionalDevelopment:ForgeGradle:70d441a286' }
}
apply plugin: 'net.minecraftforge.gradle.tweaker-client'
```

官方 ForgeGradle 3.x（唯一支持 1.13 线的）**没有** `tweaker-client` 这个 plugin descriptor ⇒
`apply plugin:` 直接失败。dimdev.org 的 maven **DNS 已死**，JitPack 是唯一可达源。

## 3. run 任务的 classpath 要手工补

fork 的 `runClient` **不**把 launchwrapper / mixin / asm 放进游戏 classpath ⇒
`ClassNotFoundException: net.minecraft.launchwrapper.Launch` / `org.spongepowered.asm.launch.MixinBootstrap`。
用 `t.classpath = t.classpath.plus(t.project.files(extra))` 追加（直接 `cp + list` 会得到 ArrayList，Gradle 拒绝）。

## 4. 已知未核（2026-10-23 更新：构建已闭，运行有两条相反结论）

**已闭**：

- **Gradle 构建**：JDK 8（Temurin 8u504）+ Gradle 4.9 + FG fork → `gradle build` **BUILD SUCCESSFUL in 1m 32s**（`buildVerified=true`）。
- **真实环境 listener 派发**：真实 1.13 client jar（notch 名）+ launchwrapper 手拼 → `[QA] registerBlocks` / `[QA] afterVanillaBootstrap`。

**⚠ 反向结论（最容易踩）**：Gradle `runClient` 里 **listener 不派发** —— 8 条
`InvalidMixinException: Super class 'MixinEnumConnectionState' ... of MixinEnumConnectionState$Play was not found in the hierarchy of target class 'net/minecraft/network/EnumConnectionState$2'`。
根因：FG 的 dev 环境是 **deobf（MCP 名）**，而 Rift 的 hook target 是 **notch 短名**。
⇒ **别用 `runClient` 验 Rift**，那是假否定。

**仍开**：

- `ClientTickable#clientTick` 每 tick 回调：未核（要进世界）。
- 进世界/主菜单交互：未核（env A 崩在 natives）。
- 1.13.2 的对照复跑：未做（该档既有记录是 21 个 hook mixin target not found）。
