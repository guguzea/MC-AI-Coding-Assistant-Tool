# Gradle 配方与实测坑位（rift 1.13.2）

> **本配方已实测**：2026-10-05 在 `E:\MC_GAME\rift-1.13.2` 真跑 `gradlew build`（BUILD SUCCESSFUL / 18 tasks）
> 与 `gradlew runClient`（LWJGL + OpenAL + 纹理图集 + Narrator 全部初始化，停在主菜单）。
> JDK = Zulu 8.0.504（`G:\zulu8.96.0.205-ca-jdk8.0.504-win_x64`，**必须 Java 8**），Gradle 4.9。

## 1. 头号结论：**Rift 用的不是 `net.minecraftforge.gradle`**

这是本档最容易照抄错的一处。Rift 用的是 DimensionalDevelopment **自己的 ForgeGradle 分支**（groupId `org.dimdev`）。
判据是 jar 里的 `META-INF/gradle-plugins/` 描述符数量与内容（本轮实读）：

| jar | 描述符数 | 有 `tweaker-client`？ |
|---|---|---|
| ForgeGradle **2.3-SNAPSHOT**（`net.minecraftforge.gradle`） | 6 | ✅ |
| ForgeGradle **3.0.197**（唯一支持 MC 1.13.2 的线） | 6 | ❌ |
| **DimensionalDevelopment/ForgeGradle `70d441a286`** | **7** | ✅ |

⇒ **「1.13.2 要 FG3」与「Rift 要 `tweaker-client`」直接冲突**。FG3 的 jar 里 `tweakClass` 字符串 **0 命中**
（不是换个 plugin id 就行，是整条机制在 FG3 里不存在）。**唯一出路就是用这个 fork**，
而它的坐标只能从 JitPack 取（`com.github.DimensionalDevelopment:ForgeGradle:70d441a286`）。

官方示例佐证：`DimensionalDevelopment/HalfLogs` 的 `build.gradle` 首两段逐字为
`classpath 'org.dimdev:ForgeGradle:2.3-SNAPSHOT'` + `apply plugin: 'net.minecraftforge.gradle.tweaker-client'`。

## 2. 可用配方（逐字）

`rift/1.13.2/scaffold/build.gradle` 已按本轮实测更新。要点：

```groovy
buildscript {
    repositories {
        maven { url = 'https://jitpack.io' }
        maven { url = 'https://maven.minecraftforge.net/' }   // fork 的 POM 要 forgeflower
        mavenCentral()
    }
    dependencies {
        classpath 'com.github.DimensionalDevelopment:ForgeGradle:70d441a286'
    }
}
apply plugin: 'net.minecraftforge.gradle.tweaker-client'
```

`minecraft { version = '1.13.2'; mappings = 'snapshot_20180921'; tweakClass = 'org.dimdev.riftloader.launch.RiftLoaderClientTweaker' }` 四行已对真构件/真构建核过。

## 3. 六个实测坑（每个都有读数）

### 坑 1：`-dev` jar 缺 refmap ⇒ 必须在游戏启动前崩溃

| 件 | `mixins.rift.refmap.json` |
|---|---|
| `Rift-1.0.4-106-dev.jar`（135 503 B） | ❌ **不在包内** |
| `Rift-1.0.4-106.jar`（140 331 B） | ✅ **14 225 B** |

用 dev jar 的症状（dev jar 的 `mixins.rift.core.json` 明明写着 `"refmap": "mixins.rift.refmap.json"`）：

```
InvalidMixinException: Shadow field field_199754_a was not located in the target class
net.minecraft.resources.VanillaPack. No refMap loaded.
```

⚠️ **`field_199754_a` 本身是对的** —— 它在 1.13.2 映射里存在，`data/forge_1.13.2/mappings/fields.csv` 查得 `field_199754_a,basePath`。
**所以这不是「Rift 与 1.13.2 不兼容」的证据，是 refmap 缺失**。换非 dev jar 即过（实测过这一关）。

### 坑 2：mixin 版本有硬地板

`0.7.4-SNAPSHOT` 会红：`MixinInitialisationError: Required mixin config mixins.rift.core.json requires mixin subsystem version 0.7.7`。
正确坐标 **不是猜的**，是 jar 自带 `profile.json` 的 `libraries` 逐字列的 `org.dimdev:mixin:0.7.11-SNAPSHOT`。
同处还列了 asm 是 **`asm` / `asm-commons` / `asm-tree` 三个 6.2 拆分包**，**不是 `asm-all:5.2`**。

仓库路径也要对：`repo.spongepowered.org/maven-public/` 是 **404**，只有 **`/repository/maven-public/`** 能解析。

### 坑 3：launchwrapper / mixin / asm 都不在游戏 classpath 上

三个声明位**逐个实测都红**：

| 声明位置 | 结果 |
|---|---|
| `implementation` | ❌ `ClassNotFoundException: net.minecraft.launchwrapper.Launch` |
| `runtimeClasspath` | ❌ 同上（`gradlew dependencies` 里能看到它，但游戏看不到） |
| `launchConfiguration`（`javap GenEclipseRunTask` 挖到的名字） | ❌ 同上 |

正解是 `doFirst` 里追加，且**必须包成 FileCollection**：

```groovy
t.classpath = t.classpath.plus(t.project.files(extra))   // ✅
t.classpath = t.classpath + extra                          // ❌ ArrayList，Gradle 拒绝
```

第二行会报 `Cannot cast object '[…49 个 File…]' with class 'java.util.ArrayList' to FileCollection`。

### 坑 4：`mappings = 'snapshot_20180921'` 对 1.13.2 是半截坐标

上游只发了 `-1.13` 后缀（`mcp_snapshot/20180921-1.13/` 在 Forge maven 上 HTTP 200），
**`-1.13.2` 是 404** ⇒ 直接构建会在 `:extractMcpMappings` 死：

```
Could not find de.oceanlabs.mcp:mcp_snapshot:20180921-1.13.2
```

两种解法（本仓取前者，因为映射语义与 `data/forge_1.13.2/mappings/` 一致）：
- 把 zip 手动放成 `libs/mcp_snapshot-20180921-1.13.2.zip`（Gradle 的 flatDir 搜索路径里正好列了这一项）——
  源文件本仓就有：`data/forge_1.13.2/mappings/mcp_snapshot-20180921-1.13.zip`；
- 或改用真正的 1.13.2 snapshot（最早 **`20190311-1.13.2`**，Forge maven 上 81 个）。

### 坑 5：assets 只能走 https（2019 年的下载器撞 2026 年的 CDN）

FG fork 用 `http://resources.download.minecraft.net/…` 下载 assets，**Mojang 现在只接 https**：
同一路径 `a9a2d584…` —— `http` 返回 **400**，`https` 返回 **200 / 529 065 B**。

⇒ 症状是 `:getAssets` 刷屏 `IOException: Server returned HTTP response code: 400`，然后 `runClient` 起不来。
**不要改 hosts、不要动系统网络栈**：直接按 1.13.2 的 asset index（`assetIndex.id = "1.13.1"`，
182 369 B，1 648 个对象）用 https 预抓到 `~/.gradle/caches/minecraft/assets/objects/<xx>/<sha1>`，
FG 发现文件已在就不下了。本轮实测：**552 新抓 + 1 096 已在缓存 + 0 失败**，之后 `getAssets` 直接通过。

### 坑 6：`libs/` 里有两份 rift jar 会 `DuplicateModException`

Rift 扫 `libs/` 下所有 jar，同一 id 出现两次即：

```
org.dimdev.riftloader.DuplicateModException: Duplicate mod rift:
 - …\libs\rift-1.0.4-106.jar
 - …\libs\rift-1.0.4-106-nodev.jar
```

换 jar 时记得把旧的**移出** `libs/`（别只是改名留在原地）。

## 4. 验证强度（四腿，别混读）

| 面 | 状态 |
|---|---|
| Gradle 构建 | ✅ `BUILD SUCCESSFUL in 1m 29s`，18 actionable tasks，含 `:reobfJar`；产物 `ExampleMod-1.0.0.jar`（10 entries，含 `riftmod.json` + `pack.mcmeta` + `ExampleMod.class`） |
| Rift loader 启动 | ✅ `RiftLoaderTweaker.injectIntoClassLoader` → `RiftLoader.load` → `findMods` 全部走到 |
| 客户端启动 | ✅ LWJGL 3.1.6 / OpenAL / `Created: 1024x512 textures-atlas` / Narrator，停在主菜单 |
| **listener 回调** | ❌ **未验证** —— 见下节 |

## 5. ⚠️ 1.13.2 悬案：**部分证实**，不是全绿

**能确认的**：Rift 1.0.4-106 **确实能在 MC 1.13.2 上把客户端拉起来**（此前本仓只知 `profile.json` 写 `inheritsFrom: "1.13"`，属未核实）。

**不能确认的**：**listener 派发在 1.13.2 上不工作**。日志里 21 个 hook mixin 全部没打上：

```
@Mixin target cfi was not found  mixins.rift.hooks.json:client.MixinMinecraft
@Mixin target cfl was not found  mixins.rift.hooks.json:client.MixinGameSettings
@Mixin target bna was not found  mixins.rift.hooks.json:MixinChunk
… (共 21 条)
```

那 21 个目标是 **notch 短名**（`cfi` / `bna` / `avh` / `cbl`），说明 **refmap 本身是好的**（SRG→notch 翻译在工作），
但**这些名字属于 MC 1.13**；1.13.2 重编后 vanilla 类名变了，于是 target 找不到。

⇒ 后果链：`client.MixinMinecraft` 没打上 ⇒ `MinecraftStartListener#onMinecraftStart()` 不会被调；
`ClientTickable#clientTick()` 的注入点同理失效 ⇒ **本轮 `[QA] RIFT_PROBE` 一个都没打出来**。
（不是 mod 写错：`riftmod.json` 形状、listener 类名、`listeners[]` FQCN 都已核过。）

**所以**：Rift 1.0.4-106 官方只支持 **MC 1.13**，1.13.2 能启动但**功能不完整**。
要在 1.13.2 上真用 Rift，**没有更新版可换** —— JitPack 构建状态实测（2026-10-05）：
ok 的只有 `v1.0.4-52` / `v1.0.4-87` / `1.0.4-87` / `1.0.4-106` / `v1.0.4-87` / `v1.0.4-106`，
**`master-dfc75ff725-1` = Error**，`1.0.2-33` / `1.0.3-45` / `1.0.4-66` 全 Error；
且上游仓 `DimensionalDevelopment/Rift` 已 **archived**（最后提交 2019-01-01）。
⇒ **可行路径只剩两条**：把 `minecraft.version` 改成 `'1.13'`（上游示例的做法，本轮未跑），
或自行 patch 那 21 个 hook mixin 的 `@Mixin(targets=…)` 到 1.13.2 的类名（需重新生成 refmap）。