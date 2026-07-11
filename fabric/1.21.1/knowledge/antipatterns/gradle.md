# Gradle / Loom 相关反模式

## ❌ 忘记运行 clean loom

**症状**：Mappings 变更后构建不生效

**原因**：Loom 缓存了旧的映射

```bash
# ❌ 错误
./gradlew build  # 可能不生效

# ✅ 正确
./gradlew clean loom
```

## ❌ 依赖配置错误

**症状**：`Could not resolve` 错误

**原因**：
- 仓库未配置
- 依赖声明格式错误
- 版本不存在

```groovy
// ❌ 错误：缺少仓库
repositories {
    // 忘记添加 Fabric Maven
}

// ✅ 正确
repositories {
    mavenCentral()
    maven { url "https://maven.fabricmc.net/" }
}

// ❌ 错误：版本格式错误
modImplementation "net.fabricmc.fabric-api:fabric-api:0.200"  // 缺少完整版本号

// ✅ 正确
modImplementation "net.fabricmc.fabric-api:fabric-api:0.200.1+build.3"
```

## ❌ 混用 modImplementation 和 modApi

**症状**：依赖传递性问题（模组无法使用第三方库的依赖）

**原因**：不了解两种配置的区别

- `modImplementation` — 不传递依赖
- `modApi` — 传递依赖

```groovy
// ❌ 错误：API 包不应该用 modImplementation
modImplementation "net.fabricmc.fabric-api:fabric-api:..."  // Fabric API 应该传递

// ✅ 正确
modApi "net.fabricmc.fabric-api:fabric-api:..."  // API 传递依赖
modImplementation "com.example:third-party-mod:..."  // 第三方库不传递
```

## ❌ 在 build.gradle 中硬编码版本

**症状**：版本管理混乱，难以升级

```groovy
// ❌ 错误
dependencies {
    minecraft "com.mojang:minecraft:1.21.1"  // 硬编码
}

// ✅ 正确：使用 gradle.properties
dependencies {
    minecraft "com.mojang:minecraft:${project.minecraft_version}"
}
```

```properties
# gradle.properties
minecraft_version=1.21.1
```

## ❌ 错误的 Loom 配置

**症状**：`Mixin injection failed` 或资源文件问题

```groovy
// ❌ 错误：删除必要的 Loom 配置
loom {
    // 删除了 accessWidenerPath 或其他必需配置
}

// ✅ 正确：保留必要配置
loom {
    accessWidenerPath = file("src/main/resources/examplemod.accesswidener")
}
```

## ❌ Gradle 版本过旧

**症状**：兼容性问题、构建失败

**原因**：使用了不支持的 Gradle 版本

```properties
# gradle/wrapper/gradle-wrapper.properties
distributionUrl=https\://services.gradle.org/distributions/gradle-8.5-bin.zip
```

Fabric 1.21.x 需要 Gradle 8.5+。

## ❌ Java 版本不匹配

**症状**：`Incompatible Java version` 错误

**原因**：系统 Java 版本与项目要求不符

```groovy
// build.gradle
java {
    toolchain.languageVersion = JavaLanguageVersion.of(21)
}

// ❌ 系统安装了 Java 17
// ✅ 需要 Java 21
```
