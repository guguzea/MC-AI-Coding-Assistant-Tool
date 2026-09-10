# Gradle 构建反模式

## 错误：Groovy 中使用 var 声明变量

**症状：** 编译错误：`unexpected token: var`

```groovy
// ❌ 错误（Groovy 不支持 var）
var replaceProperties = [
    minecraft_version: minecraft_version,
    ...
]

// ✅ 正确
def replaceProperties = [
    minecraft_version: minecraft_version,
    ...
]
```

---

## 错误：硬编码 Minecraft / NeoForge 版本号

**症状：** 版本更新时代码失效

```groovy
// ❌ 错误：写死在 build.gradle 里
neoForge {
    version = '20.4.237'
}

// ✅ 正确：引用 gradle.properties 中的属性（官方 1.20.4 scaffold 形态）
neoForge {
    version = project.neo_version
}
```

> MDG 不需要 `minecraft "net.neoforged:neoforge:..."` 依赖行——`neoForge.version` 自己接入依赖；
> 该写法是 ForgeGradle 的 `minecraft` 配置，本仓 9 份 MDG `neoforge/<ver>/scaffold/build.gradle` 里没有一行 `minecraft` 依赖。
> 另注：NeoForge 制品版本只有 NeoForge 号（`mcp-server/data/loader-api-summaries/README.md` 实测
> `net.neoforged:neoforge:20.4.251`、`21.1.x`），没有 Forge 那种 `MC版本-Loader版本` 前缀
> （`1.20.4-20.4.237` 是不存在的坐标）。

---

## 错误：NeoForge 依赖区间钉死单个补丁版

**症状：** 依赖匹配失败，或需要频繁更新版本号

`modId="neoforge"` 那条依赖的区间在官方 scaffold 里由 `gradle.properties` 的 `neo_version` 展开（文件位置 `src/main/templates/META-INF/mods.toml`）：

```toml
# ✅ 官方 1.20.4 scaffold 形态：>= 当前 neo_version
versionRange="[${neo_version},)"

# ❌ 精确钉住单个版本：任何一个补丁版都不满足
versionRange="[20.4.237]"
```

> 属性名注意：本仓 `neoforge/<ver>/scaffold/gradle.properties` 用的是 `neo_version`（配 `minecraft_version_range`、`loader_version_range`），
> **没有** `neoforge_version` / `neoforge_version_range` 这两个键——那是 Forge 档的叫法，别照抄进 NeoForge 工程。
> 另外 `[20.4.237,)` 不是「只匹配这一个版本」，它是开区间（≥20.4.237 全接受），只是把下限抬到了具体补丁版。

---

## 错误：在 MDG 工程里找 `copyIdeResources`

**症状：** 想让 IDE 运行看到新资源，照 Forge 模板去找 / 新写 `copyIdeResources = true`，在 MDG 工程里没有这个配置项

```groovy
// ❌ ForgeGradle / 旧 NeoGradle 写法，ModDevGradle 没有这个开关
minecraft {
    copyIdeResources = true
}
```

MDG 模板里没有这个开关，不需要补。官方 1.20.4+ scaffold 里唯一与 IDE 同步相关的一行是把 datagen 产物挂进同步：

```groovy
// ✅ 实测 neoforge/1.20.4/scaffold/build.gradle:164
neoForge.ideSyncTask generateModMetadata
```

> 实测：`copyIdeResources` 在本仓 10 份 `neoforge/<ver>/scaffold/build.gradle` 与全部 `data/neoforge_*` 官方语料中零命中。

---

## 错误：给 MDG 工程补 `finalizedBy 'reobfJar'`

**症状：** 把 Forge 档的 `finalizedBy 'reobfJar'` 抄进 NeoForge 工程后构建失败——该工程根本没有这个任务

`reobfJar` 是 **ForgeGradle** 的任务（把 SRG 名产物重混淆回线上名）。NeoForge 这条流程里没有它，官方模板的 `jar` 也不需要任何收尾任务。

```groovy
// ❌ 从 Forge 档抄来的收尾：MDG 工程没有 reobfJar 这个任务
jar {
    manifest { ... }
    finalizedBy 'reobfJar'
}

// ✅ NeoForge：正常配 jar / manifest 即可，不做 reobf
```

> 实测：`reobf` 与 `reobfusc` 在本仓 10 份 `neoforge/<ver>/scaffold/build.gradle` 和全部 `data/neoforge_*` 官方语料中零命中。
> 也就是说：**混淆映射这一步在 NeoForge 侧不存在**，缺它不是漏配。Forge 档才需要 `reobfJar`（见 `forge/<ver>/knowledge/antipatterns/gradle.md`）。

---

## 错误：在 neoforge.mods.toml 中使用大写 modId

**症状：** mod 无法加载

```toml
# ❌ 错误
[[mods]]
modId="ExampleMod"   # 大写不允许

# ✅ 正确
[[mods]]
modId="examplemod"   # 全部小写
```

---

## 错误：缺少 Java toolchain 配置

**症状：** Gradle 使用系统默认 Java 版本（可能不兼容）

```groovy
// ❌ 遗漏
// Minecraft 1.18+ 需要 Java 17 或更高

// ✅ 必须配置
java.toolchain.languageVersion = JavaLanguageVersion.of(17)
```

---

## 错误：在 Gradle 配置中写死 repository

**症状：** 依赖下载失败或拉取错误的依赖

```groovy
// ❌ 错误
repositories {
    maven { url "https://some-cdn.example.com/maven" }
}

// ✅ 正确：优先使用官方源
repositories {
    maven {
        name = "NeoForge"
        url = "https://maven.neoforged.net/"
    }
}
```

---

## 错误：混用 / 写错构建插件 id

**症状：** 构建失败、插件版本区间解析不到，或两套 DSL 混在一起

```groovy
// ❌ 错误：同时上两套 NeoForge 构建插件
plugins {
    id 'net.neoforged.moddev' version '2.0.144'
    id 'net.neoforged.gradle.userdev' version '[7.0,7.2)'   // 冲突！
}

// ✅ 正确：只留一套（本仓 10 份版本 scaffold 中 9 份用 MDG）
plugins {
    id 'java-library'
    id 'maven-publish'
    id 'net.neoforged.moddev' version '2.0.144'
    id 'idea'
}
```

插件 id 实测（2026-09-11，直连仓库探得）：

| id | 是什么 | 可用版本 |
| --- | --- | --- |
| `net.neoforged.moddev` | ModDevGradle，`neoForge { }` DSL；本仓 10 份 `neoforge/<ver>/scaffold` 中 9 份用它（唯一例外 `1.20.1`＝Forge 兼容层短档） | plugins.gradle.org 最新 `2.0.146`（scaffold 钉 `2.0.143/2.0.144`） |
| `net.neoforged.gradle.userdev` | NeoGradle，官方 Mod Generator 提供的另一选择 | maven.neoforged.net 最新 `7.1.38` |
| `net.neoforged.gradle` | **旧（Forge 时代）NeoGradle**，插件门户上最新只到 `6.0.21` | 写 `[7.0.15,7.2)` 永远解析不到 |
| `net.minecraftforge.gradle` | ForgeGradle，Forge 档专用 | 不要出现在 NeoForge 工程里 |

> 两套 NeoForge 插件的 DSL 不同名：MDG 是 `neoForge { version = ... }`，
> 旧 `net.neoforged.gradle` + ForgeGradle 才是 `minecraft { mappings channel: ... }`。混抄必炸。
