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

## 4. 已知未核（2026-10-23 更新：部分已闭）

**已闭**：Rift 1.0.4-106 在 MC **1.13** 上 listener 会被回调 —— 手工链路（BMCLAPI 取 client + `javac --release 8` + launchwrapper 手拼，非 Gradle）实测日志：
`Loaded mod 'qaprobe'` → `[QA] registerBlocks` → `[QA] afterVanillaBootstrap`。详见 `pack.meta.json` 的 `scaffold.runtimeProbe`。

**仍开**：

- 本档样板块**未**在本机用 Gradle 重跑（`buildVerified=false`：本机无 JDK 8，FG fork 只能 Java 8）。
- `ClientTickable#clientTick` 的每 tick 回调：未核（要进世界；本轮崩在 `lwjgl.dll` 缺 natives，早于 tick）。
- 进主菜单/进世界：未核（需 natives + 186 MB assets）。
- 1.13.2 的对照复跑：未做（该档既有记录是 21 个 hook mixin target not found）。
