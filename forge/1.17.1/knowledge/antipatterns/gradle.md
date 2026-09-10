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

## 错误：硬编码 Minecraft / Forge 版本号

**症状：** 版本更新时代码失效

```groovy
// ❌ 错误
minecraft "net.minecraftforge:forge:1.17.1-37.1.0"

// ✅ 正确：引用 gradle.properties 中的属性
minecraft "net.minecraftforge:forge:${minecraft_version}-${forge_version}"
```

---

## 错误：forge_version_range 过窄

**症状：** 依赖匹配失败，或需要频繁更新版本号

```properties
# ❌ 错误
forge_version=37.1.0
forge_version_range=[37.1.0,)  # 只匹配这一个版本

# ✅ 正确：匹配所有 37.x 版本
forge_version=37.1.0
forge_version_range=[37,)
```

---

## 错误：照抄 1.19.4+ 模板的 copyIdeResources

**症状：** `gradlew` 在配置阶段就失败 —— `A problem occurred evaluating root project …`，底层异常 `groovy.lang.MissingPropertyException: copyIdeResources`

`copyIdeResources` 是 ForgeGradle 6 才加入的 `minecraft { }` 扩展属性；本档用 ForgeGradle `5.1.+`，没有这一项。从 1.19.4 / 1.20.x 模板复制 `build.gradle` 时会把它一起带进来，删掉即可。本档 `scaffold/build.gradle` 不含该行。

```groovy
// ❌ 本档 FG 无该属性，写了立刻破构建
minecraft {
    copyIdeResources = true
    runs { ... }
}

// ✅ 本档写法：minecraft { } 内只保留 mappings + runs
minecraft {
    mappings channel: mapping_channel, version: mapping_version
    runs { ... }
}
```

实测取证（同族，2026-09-10 本机）：`forge/1.18.2` scaffold 在 `minecraft { }` 内写 `copyIdeResources = true` + FG `[5.1.2,5.2)` + Gradle 7.6 + JDK 17.0.12 → `gradlew help --stacktrace` 报 `Caused by: groovy.lang.MissingPropertyException: copyIdeResources`，随后级联 `Missing 'minecraft' dependency.`。官方 1.17.1 MDK（FG `5.1.+`）亦不含该行；含该行的是 FG `[6.0,6.2)` 的官方 MDK（1.18.2-40.3.0 / 1.19.4 / 1.20.1 / 1.20.4）。「IDE 改资源不生效」是 FG 6 时代的症状；本档 FG 5.1 的替代做法未核实，不要臆造。

---

## 错误：reobfJar 未与 jar 任务关联

**症状：** 发布时 jar 文件仍然混淆，服务器无法识别 mod

```groovy
// ❌ 遗漏
jar {
    manifest { ... }
}

// ✅ 关联 reobfJar
jar {
    manifest { ... }
    finalizedBy 'reobfJar'
}
```

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
// Minecraft 1.17.1 需要 Java 16 或更高

// ✅ 必须配置
java.toolchain.languageVersion = JavaLanguageVersion.of(16)
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
        name = "Jared's maven"
        url = "https://maven.blamejared.com/"  // JEI 官方源
    }
}
```
