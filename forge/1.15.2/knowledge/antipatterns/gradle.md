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
minecraft "net.minecraftforge:forge:1.15.2-31.2.50"

// ✅ 正确：引用 gradle.properties 中的属性
minecraft "net.minecraftforge:forge:${minecraft_version}-${forge_version}"
```

---

## 错误：forge_version_range 过窄

**症状：** 依赖匹配失败，或需要频繁更新版本号

```properties
# ❌ 错误
forge_version=31.2.50
forge_version_range=[31.2.50,)  # 只匹配这一个版本

# ✅ 正确：匹配所有 31.x 版本
forge_version=31.2.50
forge_version_range=[31,)
```

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
// Minecraft 1.15.2 要求 Java 8（官方 gettingstarted.md:14「Minecraft and MinecraftForge both compile against Java 8」）

// ✅ 必须配置
java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(8)
    }
}
```

## 错误：FG4 档混用 Gradle 7+ 构造 / Parchment 通道

**症状：** 配置期就失败，一行 Java 都没编译（2026-09-11 真机逐条复现）：

```
Failed to apply plugin 'net.minecraftforge.gradle'.
   > Found Gradle version Gradle 7.3.3. Versions Gradle 7.0 and newer are not supported yet.
     Note: Support for Gradle 7 will be added in ForgeGradle 5.
Could not generate a decorated class for type FoojayToolchainsPlugin. > org/gradle/jvm/toolchain/JavaToolchainResolverRegistry
java.lang.IllegalArgumentException: Unknown mapping provider: parchment_2021.07.27-1.16.5
Could not find method base() for arguments [...] on project 'examplemod' of type DefaultProject
```

**根因：** ForgeGradle `[4.1,4.2)` 硬拒 Gradle ≥ 7，而下列构造只在 Gradle 7+ 存在／生效——两者不存在共同可用版本：

```groovy
// ❌ FG4 档不可用（本包 2026-09-11 前就是这样，pack.meta.buildVerified=false）
// settings.gradle
plugins { id 'org.gradle.toolchains.foojay-resolver-convention' version '0.4.0' }
// build.gradle
base { archivesName = mod_id }
// gradle.properties
mapping_channel=parchment        // FG4 无该 provider

// ✅ FG4 档形态
// settings.gradle：不加 foojay；改用 JDK 8 运行 Gradle（JAVA_HOME / org.gradle.java.home）
archivesBaseName = mod_id
mapping_channel=official         // 或 snapshot（MCP），见 AGENTS.md Mappings 行
```

**处置：** `gradle-wrapper.properties` 的钉值属于「与官方 MDK 的代差」，按仓库裁定不擅自改（只在 `pack.meta.json` / `AGENTS.md` 记警告）；上面四处是模板自身缺陷，必须落到 FG4 可用形态。要 Parchment 就得先把 FG 升到 5+，二者不能同时保留。

## 错误：把 FG4 首建的 `NoSuchFileException(*.tsrg)` 当成下载失败

**症状：**

```
java.nio.file.NoSuchFileException: C:\Users\<you>\.gradle\caches\forge_gradle\mcp_repo\de\oceanlabs\mcp\mcp_config\1.15.2\mcp_config-1.15.2-obf_to_srg.tsrg
    at ...MCPRepo.findRenames(...)
java.nio.file.NoSuchFileException: ...\minecraft_user_repo\de\oceanlabs\mcp\mcp_config\1.15.2-20200515.085601\srg_to_snapshot_20200514-1.15.1.tsrg
    at ...MinecraftUserRepo.findSrgToMcp(...)
```

**根因：** FG4 写 tsrg 时用 `Files.newOutputStream` 而不先 `mkdirs`，父目录不存在即抛 `NoSuchFileException`。**不是**网络问题、**不是**「MCP 快照坐标不存在」、也不是模板代码缺陷——本仓库曾据此误判过 `official` 通道不可用。

**处置：** 按报错给出的完整路径 `mkdir -p` 其父目录后重跑构建（第二次 FG4 会自己把上层目录建出来）；诊断 `diagnose_gradle` 报 tsrg 缺失时先核对这一条。
