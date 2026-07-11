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
// ❌ 错误
minecraft "net.neoforged:neoforge:1.20.4-20.4.237"

// ✅ 正确：引用 gradle.properties 中的属性
minecraft "net.neoforged:neoforge:${neoform_version}"
```

---

## 错误：neoforge_version_range 过窄

**症状：** 依赖匹配失败，或需要频繁更新版本号

```properties
# ❌ 错误
neoforge_version=20.4.237
neoforge_version_range=[20.4.237,)  # 只匹配这一个版本

# ✅ 正确：匹配所有 20.4.x 版本
neoforge_version=20.4.237
neoforge_version_range=[20.4,)
```

---

## 错误：copyIdeResources 未启用

**症状：** IDE 中修改资源文件后游戏不加载新内容

```groovy
// ❌ 遗漏
minecraft {
    runs {
        configureEach { ... }
    }
}

// ✅ 必须启用
minecraft {
    copyIdeResources = true
    runs { ... }
}
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

## 错误：混用不同 Gradle 插件

**症状：** 构建失败或依赖冲突

```groovy
// ❌ 错误：同时使用 ForgeGradle 和 NeoGradle
plugins {
    id 'net.minecraftforge.gradle' version '[6.0,6.2)'  // Forge
    id 'net.neoforged.gradle' version '[7.0,7.2)'    // NeoForge - 冲突！
}

// ✅ 正确：只使用 NeoGradle
plugins {
    id 'net.neoforged.gradle' version '[7.0,7.2)'
}
```
