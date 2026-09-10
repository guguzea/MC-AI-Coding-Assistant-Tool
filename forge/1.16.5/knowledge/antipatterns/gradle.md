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
minecraft "net.minecraftforge:forge:1.16.5-36.2.34"

// ✅ 正确：引用 gradle.properties 中的属性
minecraft "net.minecraftforge:forge:${minecraft_version}-${forge_version}"
```

---

## 错误：forge_version_range 过窄

**症状：** 依赖匹配失败，或需要频繁更新版本号

```properties
# ❌ 错误
forge_version=36.2.34
forge_version_range=[36.2.34,)  # 只匹配这一个版本

# ✅ 正确：匹配所有 36.x 版本
forge_version=36.2.34
forge_version_range=[36,)
```

---

## 错误：照抄 1.19.4+ 模板的 copyIdeResources

**症状：** `gradlew` 在配置阶段就失败 —— `A problem occurred evaluating root project …`，底层异常 `groovy.lang.MissingPropertyException: copyIdeResources`

`copyIdeResources` 是 ForgeGradle 6 才加入的 `minecraft { }` 扩展属性；本档用 ForgeGradle `[4.1,4.2)`，没有这一项。从 1.19.4 / 1.20.x 模板复制 `build.gradle` 时会把它一起带进来，删掉即可。本档 `scaffold/build.gradle` 已不含该行。

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

实测取证（同族，2026-09-10 本机）：`forge/1.18.2` scaffold 在 `minecraft { }` 内写 `copyIdeResources = true` + FG `[5.1.2,5.2)` + Gradle 7.6 + JDK 17.0.12 → `gradlew help --stacktrace` 报 `Caused by: groovy.lang.MissingPropertyException: copyIdeResources`，随后级联 `Missing 'minecraft' dependency.`。本档 FG 更旧，同样不含该属性；官方 1.16.5-36.2.34 MDK（FG `5.1.+`）亦不含该行，含该行的是 FG `[6.0,6.2)` 的官方 MDK（1.18.2-40.3.0 / 1.19.4 / 1.20.1 / 1.20.4）。「IDE 改资源不生效」是 FG 6 时代的症状；本档 FG 4.1 的替代做法未核实，不要臆造。

---

## 错误：minecraft { } 内裸写 mappings channel/version

**症状：** 配置阶段报 `Must specify both mappings channel and version`，而 `gradle.properties` 里明明写了 `mapping_channel` / `mapping_version`。

```groovy
// ❌ 本档 FG4 下必破
minecraft {
    mappings channel: mapping_channel, version: mapping_version
}

// ✅ 显式走 project，绕开扩展的同名字段
minecraft {
    mappings channel: project.mapping_channel, version: project.mapping_version
}
```

根因（本机 javap -p 取证）：ForgeGradle 4.1.16 与 3.0.197 的 `net.minecraftforge.gradle.common.util.MinecraftExtension` 自身声明了 `protected java.lang.String mapping_channel; mapping_version;` 两个字段；FG 5.1.77 / 6.0.54 已删除。`minecraft { }` 闭包按 DELEGATE_FIRST 解析名字，裸名先命中扩展的那两个 **空字段**，`gradle.properties` 的项目属性根本没机会参与 → 扩展读到 channel/version 皆空，于是报「两个都没给」。

所以报错文案是误导：要改的是 `build.gradle` 里那两处的限定符，不是 `gradle.properties`。1.17.1+ 各档同样裸写不会发病（扩展已无该二字段），不要拿邻档「能跑」反证本档写法正确。

取证边界（必读）：本档 scaffold 至今 **没有** 跑通绿构建——`pack.meta.json` 的 `scaffold.gaps` 记了钉值自相矛盾（FG `[4.1,4.2)` 拒绝 Gradle 7+，而 settings.gradle 的 foojay-resolver-convention 0.4.0 与 `base { archivesName }` 又要求 Gradle 7.1+/7.6+）。本节结论不依赖本档构建，来源是 ① FG 4.1.16 的 javap 字段表；② 同代 1.14.4（FG 3.0.197）加 `project.` 后真机 BUILD SUCCESSFUL；③ 本档坐标 `parchment / 2021.07.27-1.16.5` 经 curl `maven.parchmentmc.org/org/parchmentmc/data/parchment-1.16.5/maven-metadata.xml` 核实存在（该清单含 `2021.07.27`）。

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
// Minecraft 1.16.5：官方口径是「按 Java 8 编译、只能用 Java 8 代码」
// （gettingstarted.md:14 / primer_1_16_5.md:614）

// ✅ 必须配置：官方 1.16.5-36.2.34 MDK build.gradle:19 即 of(8)
java.toolchain.languageVersion = JavaLanguageVersion.of(8)
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

---

## 错误：Mixin compatibilityLevel 配置错误

**症状：** Mixin 无法注入，编译或运行时出错

```groovy
// ❌ 错误（Java 8 项目使用 JAVA_17）
"compatibilityLevel": "JAVA_17"

// ✅ 正确
"compatibilityLevel": "JAVA_8"
```

---

## 错误：FG4 档混用 Gradle 7+ 构造 / Parchment 通道

**症状：** 配置期就失败，一行 Java 都没编译（2026-09-11 真机逐条复现于本档）：

```
Failed to apply plugin 'net.minecraftforge.gradle'.
   > Found Gradle version Gradle 7.6. Versions Gradle 7.0 and newer are not supported yet.
     Note: Support for Gradle 7 will be added in ForgeGradle 5.
Could not generate a decorated class for type FoojayToolchainsPlugin. > org/gradle/jvm/toolchain/JavaToolchainResolverRegistry
Could not find method base() for arguments [...] on project 'examplemod' of type DefaultProject
java.lang.IllegalArgumentException: Unknown mapping provider: parchment_2021.07.27-1.16.5
```

**根因：** ForgeGradle `[4.1,4.2)` 硬拒 Gradle ≥ 7；`foojay-resolver-convention 0.4.0` 与 `base { archivesName }` 需要 Gradle 7+；Parchment 通道依赖 FG5+ 才有的 `net/minecraftforge/gradle/mcp/ChannelProvider`（补 `org.parchmentmc.librarian.forgegradle 1.+` 也只得到 `Could not generate a decorated class for type LibrarianForgeGradlePlugin`）。三者在 FG4 上没有共同可用版本。

```groovy
// ❌ 本包 2026-09-11 前的形态（pack.meta.buildVerified=false）
plugins { id 'org.gradle.toolchains.foojay-resolver-convention' version '0.4.0' }  // settings.gradle
base { archivesName = mod_id }                                                     // build.gradle
mapping_channel=parchment                                                          // gradle.properties

// ✅ FG4 可用形态（本包已改）
// settings.gradle 不加 foojay ⇒ 用 JDK 8 运行 Gradle（JAVA_HOME / org.gradle.java.home）
archivesBaseName = mod_id
mapping_channel=official   // MCP 工程改 snapshot；命名随之换形，见 AGENTS.md Mappings 行
```

**处置：** `gradle-wrapper.properties` 的 Gradle 钉值属于「与官方 MDK 的代差」，按仓库裁定不擅自改（只在 `pack.meta.json` / `AGENTS.md` 记警告）；上面四处是模板自身缺陷，必须落到 FG4 可用形态。要用 Parchment 必须先把 FG 升到 5+，不能两边都留。

## 错误：把 FG4 首建的 `NoSuchFileException(*.tsrg)` 当成下载失败

**症状：** `java.nio.file.NoSuchFileException: %USERPROFILE%\.gradle\caches\forge_gradle\mcp_repo\de\oceanlabs\mcp\mcp_config\<ver>\mcp_config-<ver>-obf_to_srg.tsrg`（`MCPRepo.findRenames`），或 `...\minecraft_user_repo\de\oceanlabs\mcp\mcp_config\<ver>-<timestamp>\srg_to_*.tsrg`（`MinecraftUserRepo.findSrgToMcp`）。

**根因：** FG4 写 tsrg 用 `Files.newOutputStream` 而不先 `mkdirs`，父目录不存在即抛错。**不是**网络问题、**不是**映射坐标不存在、也不是模板代码缺陷；本仓库曾据此误判 `official` 通道「下载不到」。

**处置：** 按报错的完整路径预建父目录后重跑（第二次 FG4 会自己把上层目录建出来）。逐条路径实例见 `forge/1.15.2/knowledge/antipatterns/gradle.md` 同名小节。
