# Making mods with Rift（wiki 落盘）

- **抓取日**：2026-08-13
- **URL**：https://github.com/DimensionalDevelopment/Rift/wiki/Making-mods-with-Rift
- **编辑**：Runemoro，2018-08-26
- **仓库**：已归档只读

## 已核实事实

- Gradle 插件：`apply plugin: 'net.minecraftforge.gradle.tweaker-client'`
- Java 8；`tweakClass = 'org.dimdev.riftloader.launch.RiftLoaderClientTweaker'`
- 依赖示例（wiki 原文）：`implementation 'org.dimdev:rift:1.0.3-45:dev'`
- Maven：`https://www.dimdev.org/maven/`（实施时可能已失效；scaffold 须提供 `libs/` 备用，禁止写死失效仓库当唯一源）
- 元数据文件官方拼写：**`riftmod.json`**（jar 根 / `src/main/resources`）
- `riftmod.json` 字段：`id`, `name`, `authors`, `listeners`（类名字符串数组）
- Listener 类须有 **public 无参构造**；Rift 每类只建一个实例
- Mixin / 自定义 ClassFileTransformer：实现 `org.dimdev.riftloader.listener.InitializationListener`（`onInitialization()`），建议单独一类
- Access transformer 文件：`src/main/resources/access_transformations.at`（notch 名）
- 资源：`resources/assets/<modid>` 与 `resources/data/<modid>`
- 示例模组：HalfLogs

## riftmod.json 示例（wiki）

```json
{
  "id": "halflogs",
  "name": "Half logs",
  "authors": ["Runemoro"],
  "listeners": ["org.dimdev.halflogs.HalfLogs"]
}
```

Rift-MDK 另支持 listener 对象形式：`{"class":"...","side":"client","priority":10}`。

## 依赖源可用性核查（2026-10-04 实测；**2026-10-05 已找到可用替代并对真构件核过 API**）

本页记的依赖源 `https://www.dimdev.org/maven/`（坐标 `org.dimdev:rift:1.0.3-45:dev`）**已失效**：

- `https://www.dimdev.org/maven/org/dimdev/rift/maven-metadata.xml` → **DNS `ENOTFOUND`（域名解析不了，不只是 404）**
- `https://dimdev.org/maven/...`（去 www）→ 同样 **`ENOTFOUND`**

**替代源 = JitPack（2026-10-05 从「未核」升级为「可用，已编译验证」）**：

- `https://jitpack.io/com/github/DimensionalDevelopment/Rift/maven-metadata.xml` 可读：groupId `com.github.DimensionalDevelopment`、artifactId `Rift`、
  release **`1.0.4-106`**，versions = `v1.0.4-52` / `v1.0.4-87` / `1.0.4-87` / `v1.0.4-106` / `1.0.4-106`。
- ✅ **`dev` classifier 确有**（四个件全 HTTP 200：`Rift-1.0.4-106.pom` / `.jar` / **`-dev.jar`** / `-sources.jar`）。
  `https://jitpack.io/com/github/DimensionalDevelopment/Rift/1.0.4-106/Rift-1.0.4-106-dev.jar` ⇒ **135 503 B / 155 entries**，
  sha256 `5B5E333D7DD77E89321C72802A68DBCF3F7736139EDD3AA777894A58096D5463`。一行 curl 见 `scaffold/libs/README.md`。
- JitPack 构建 API（`https://jitpack.io/api/builds/com.github.DimensionalDevelopment/Rift`）本次**取到了**（上次超时）：
  ok = `1.0.4-52` / `1.0.4-87` / `1.0.4-106`（含 `v` 前缀别名）；Error = `1.0.2-33` / `1.0.4-66` / `master-dfc75ff725-1`。
- 上游仓现状（GitHub API 2026-10-05）：**`archived: true`**、default `master`、最后 push **2019-01-01**、描述「A lightweight mod loader and API for Minecraft 1.13」；许可 **MIT**。
- ✅ **API 与本仓 listener 表一致（javap 对真构件核过）**：
  `org.dimdev.rift.listener.client.ClientTickable` = **`public abstract void clientTick()`（无参）** —— 与 `listeners.md:57` 逐字相符；
  `org.dimdev.rift.listener.ServerTickable` = `void serverTick(net.minecraft.server.MinecraftServer)` —— 与 `listeners.md:45` 相符；
  `org.dimdev.riftloader.launch.RiftLoaderClientTweaker` **在 jar 里** ⇒ 本档 scaffold 的 `tweakClass` 值正确。
  ⚠️ 本 jar **没有** `InstanceOfServerTickable`（全 jar 扫该名 = 0 命中）—— 若别处提到它，一律以 `ServerTickable` 为准。
- ✅ jar 自带的 `riftmod.json` schema = `{id, name, authors[], listeners[]}`，与本仓桥模板生成的 `riftmod.json` **同形**（逐字对照过）。
- jar 内 `profile.json`：`"inheritsFrom": "1.13"`、`releaseTime 2018-07-18`、`arguments.game = ["--tweakClass","org.dimdev.riftloader.launch.RiftLoaderClientTweaker"]`
  ⇒ **官方标称 MC 1.13**（指**原生线**）。1.13.2 真机结果见本页底部「2026-10-05 真机更正」第 3 条：客户端起得来、21 个 hook mixin target not found ⇒ listener 不派发；**1.13.1/1.13.2 的支持线 = Chocohead 社区分支 `newerer`/`newerest`**（2026-10-06 用户裁定 + GitHub API 同日核，详 `bridge-api.md` §3.3 第 3 条）。
- **编译验证已升级**：把本仓生成的 rift 桥（`generate_playtest_driver --platform=rift --version=1.13.2 --driverMode=external_bridge`）
  对**这只真 jar**（Rift 侧走真构件；MC 侧当时仍替身 —— **2026-10-06 已升级为真构件**：`forgeBin-1.13.2-25.0.223_mapped_snapshot_20180921-1.13.jar`，桥用名字逐名 javap 43/43 在盘）JDK 8 `javac -encoding UTF-8` ⇒ `RIFT_REALJAR_EXIT=0`，产出 5 个 class。

**版本错位（仍成立，但已不构成阻塞）**：本页 wiki 记的是 `1.0.3-45`，JitPack 上只有 `1.0.4-*`。
上表的 javap 比对已确认 **`1.0.4-106` 的 listener API 与本表逐字一致**，因此对本仓桥模板可当等价替换使用；
但「`1.0.3-45` 本身」在 JitPack 上不存在，别再找。

## ⚠️ 2026-10-05 真机更正（三条，本页原文已被推翻或细化）

1. **本页「依赖示例（wiki 原文）：`implementation 'org.dimdev:rift:1.0.3-45:dev'`」不能照抄**。
   真构建用的是 `implementation name: 'rift-1.0.4-106'`（**非 dev**）。**`-dev` classifier 的 jar 缺
   `mixins.rift.refmap.json`**（其 `mixins.rift.core.json` 却声明了 refmap），运行期死在
   `InvalidMixinException: Shadow field field_199754_a ... No refMap loaded`；**非 dev jar 有该 refmap（14 225 B）**。
2. **本页「Gradle 插件：`apply plugin: 'net.minecraftforge.gradle.tweaker-client'`」只在该 FG 分支下存在**，
   不是 `net.minecraftforge.gradle` 的 —— 实读 jar 描述符：DimensionalDevelopment 的 fork **7 个（含）**、
   `net.minecraftforge.gradle:ForgeGradle:2.3` **6 个（含）**、**`ForgeGradle:3.0.197` 6 个（不含）**，
   且 FG 3.0.197 全 jar 搜 `tweakClass` **0 命中** ⇒ **1.13.2 需要的 FG3 与这个 plugin id 不兼容**。
   坐标只能从 JitPack 取：`com.github.DimensionalDevelopment:ForgeGradle:70d441a286`。
3. **本页「Java 8 + `minecraft { version = '1.13' }`」是对的、且必须保留**：2026-10-05 实测 Rift 在 **1.13.2** 上
   **客户端能起来但 21 个 hook mixin 全部 target not found**（notch 名 `cfi`/`cfl`/`bna`/`bjl` 属 1.13）
   ⇒ **listener 完全不派发**。**更正（2026-10-06）**：原文「不存在支持 1.13.2 的更新版」只查了**原生线**即判死，被用户裁定推翻：
   支持线在 Chocohead 仓库分支 `newerer`（`build.gradle` 自标 `1.13.1`）/ `newerest`（自标 `1.13.2`），GitHub API 同日核。
   **原生线本身确无更新件**（JitPack 上 ok 的最高就是 `1.0.4-106`，`master-dfc75ff725-1` = Error，上游已 archived）；
   `newerest` 的 JitPack 分支件 2026-10-06 呈 Building/超时、未取到成品 ⇒ 本档 scaffold 仍是「106 能启动但不派发」，要真跑得自编译 `newerest`。

完整配方与六个坑见 `../../code-patterns/gradle-recipe.md`。
