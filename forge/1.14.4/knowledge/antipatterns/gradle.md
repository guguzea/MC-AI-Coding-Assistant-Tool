# Gradle 构建反模式

## 错误：Groovy 中使用 var 声明变量

**症状：** 编译错误：`unexpected token: var`

```groovy
// ❌ 错误（Groovy 不支持 var）
def replaceProperties = [
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

## 错误：硬编码 Minecraft / Forge 版本号

**症状：** 版本更新时代码失效

```groovy
// ❌ 错误
minecraft "net.minecraftforge:forge:1.14.4-28.2.0"

// ✅ 正确：引用 gradle.properties 中的属性
minecraft "net.minecraftforge:forge:${minecraft_version}-${forge_version}"
```

---

## 错误：forge_version_range 过窄

**症状：** 依赖匹配失败，或需要频繁更新版本号

```properties
# ❌ 错误
forge_version=28.2.0
forge_version_range=[28.2.0,)  # 只匹配这一个版本

# ✅ 正确：匹配所有 28.x 版本
forge_version=28.2.0
forge_version_range=[28,)
```

---

## 错误：照抄 1.19.4+ 模板的 copyIdeResources

**症状：** `gradlew` 在配置阶段就失败 —— `A problem occurred evaluating root project …`，底层异常 `groovy.lang.MissingPropertyException: copyIdeResources`

`copyIdeResources` 是 ForgeGradle 6 才加入的 `minecraft { }` 扩展属性；本档用 ForgeGradle `3.+`，没有这一项。从 1.19.4 / 1.20.x 模板复制 `build.gradle` 时会把它一起带进来，删掉即可。本档 `scaffold/build.gradle` 不含该行。

```groovy
// ❌ 本档 FG 无该属性，写了立刻破构建
minecraft {
    copyIdeResources = true
    runs { ... }
}

// ✅ 本档写法：minecraft { } 内只保留 mappings + runs（mappings 变量须显式 project.，见下一节）
minecraft {
    mappings channel: project.mapping_channel, version: project.mapping_version
    runs { ... }
}
```

实测取证（同族，2026-09-10 本机）：`forge/1.18.2` scaffold 在 `minecraft { }` 内写 `copyIdeResources = true` + FG `[5.1.2,5.2)` + Gradle 7.6 + JDK 17.0.12 → `gradlew help --stacktrace` 报 `Caused by: groovy.lang.MissingPropertyException: copyIdeResources`，随后级联 `Missing 'minecraft' dependency.`。本档 FG 更旧，同样不含该属性；官方 1.14.4-28.2.26 MDK（FG `3.+`）亦不含该行，含该行的是 FG `[6.0,6.2)` 的官方 MDK（1.18.2-40.3.0 / 1.19.4 / 1.20.1 / 1.20.4）。「IDE 改资源不生效」是 FG 6 时代的症状；本档 FG 3 的替代做法未核实，不要臆造。

---

## 错误：minecraft { } 内裸写 mappings channel/version

**症状：** 配置阶段报 `Must specify both mappings channel and version`，而 `gradle.properties` 里明明写了 `mapping_channel` / `mapping_version`。

```groovy
// ❌ 本档 FG3 下必破
minecraft {
    mappings channel: mapping_channel, version: mapping_version
}

// ✅ 显式走 project，绕开扩展的同名字段
minecraft {
    mappings channel: project.mapping_channel, version: project.mapping_version
}
```

根因（本机 javap -p 取证）：ForgeGradle 3.0.197 与 4.1.16 的 `net.minecraftforge.gradle.common.util.MinecraftExtension` 自身声明了 `protected java.lang.String mapping_channel; mapping_version;` 两个字段；FG 5.1.77 / 6.0.54 已删除。`minecraft { }` 闭包按 DELEGATE_FIRST 解析名字，裸名先命中扩展的那两个 **空字段**，`gradle.properties` 的项目属性根本没机会参与 → 扩展读到 channel/version 皆空，于是报「两个都没给」。

所以报错文案是误导：要改的是 `build.gradle` 里那两处的限定符，不是 `gradle.properties`。直接写字面量（`mappings channel: 'snapshot', version: '20190719-1.14.3'`）同样可绕开，但本仓库模板统一从 gradle.properties 取值，便于换版本。

1.17.1+ 各档同样裸写不会发病（扩展已无该二字段）——**不要**拿邻档「能跑」反证本档写法正确。

实测取证（2026-09-11 本机）：本档 scaffold 加 `project.` 限定后 `gradlew build` → BUILD SUCCESSFUL in 24s（JDK 8 + Gradle 4.9 wrapper + FG 3.0.197 + forge 1.14.4-28.2.26 + snapshot/20190719-1.14.3，产物 build/libs/examplemod-1.0.0.jar 4734 B，含 :reobfJar）；改前为该条配置期异常。

---

## 错误：在 mods.toml 中使用大写 modId

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
// Minecraft 1.14.4 是 Java 8：官方 1.14.4-28.2.26 MDK build.gradle:19 写 '1.8'

// ✅ 必须配置（1.14.4 的 MDK 用 Gradle 4.9，没有 java.toolchain DSL，只能这样钉）
sourceCompatibility = targetCompatibility = compileJava.sourceCompatibility = compileJava.targetCompatibility = '1.8'
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
    mavenCentral()
    maven { url "https://maven.minecraftforge.net/" }
}
```
