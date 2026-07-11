# Gradle/Loom 构建反模式（Fabric 1.16.5）

## 症状

- 构建时报 `Could not resolve net.fabricmc`
- `Mixin injection failed`
- Loom 无法生成正确的映射
- `No such property` 错误

## 根因分析

### 1. 缺少 Fabric Maven 仓库

**错误配置：**
```groovy
repositories {
    mavenCentral()  // ❌ 缺少 Fabric Maven
}
```

**正确配置：**
```groovy
repositories {
    mavenCentral()
    maven { url "https://maven.fabricmc.net/" }  // ✅ 必需
}
```

### 2. Loom 版本不兼容

**错误配置：**
```groovy
plugins {
    id 'fabric-loom' version '1.4-SNAPSHOT'  // ❌ 1.16.5 不支持
}
```

**正确配置：**
```groovy
plugins {
    id 'fabric-loom' version '0.10.31'  // ✅ 1.16.5 专用
}
```

### 3. Fabric API 依赖配置错误

**错误配置：**
```groovy
dependencies {
    // ❌ 使用了错误的 maven 组名
    modImplementation "net.fabricmc.fabric-api:fabric-api:0.16.x+build.4-1.16.5"
}
```

**正确配置：**
```groovy
dependencies {
    // ✅ 使用正确的 maven 组名 net.fabricmc.fabric-api
    modImplementation "net.fabricmc.fabric-api:fabric-api:0.16.x+build.4-1.16.5"
}
```

### 4. 混用 modImplementation 和 modApi

**错误配置：**
```groovy
dependencies {
    // ❌ Fabric API 应该使用 modApi（需要传递依赖）
    modImplementation "net.fabricmc.fabric-api:fabric-api:0.16.x+build.4-1.16.5"
}
```

**正确配置：**
```groovy
dependencies {
    // ✅ Fabric API 使用 modApi
    modApi "net.fabricmc.fabric-api:fabric-api:0.16.x+build.4-1.16.5"
    // ✅ 第三方 mod 使用 modImplementation
    modImplementation "com.example:third-party:1.0.0"
}
```

### 5. 忘记 clean loom

**错误：** 映射变更后直接 build。

**正确方案：**
```bash
./gradlew clean loom
```

### 6. gradle.properties 版本号不一致

**错误配置：**
```properties
# ❌ minecraft_version 和实际使用不一致
minecraft_version=1.20.1
```

**正确配置：**
```properties
# ✅ 与 build.gradle 中的 minecraft 依赖一致
minecraft_version=1.16.5
```

### 7. accessWidener 路径错误

**错误配置：**
```groovy
loom {
    accessWidenerPath = file("src/main/resources/examplemod.accesswidener")  // ❌ 相对路径
}
```

**正确配置：**
```groovy
loom {
    accessWidenerPath = file("src/main/resources/examplemod.accesswidener")
    // ✅ Loom 会自动处理
}
```

## 诊断清单

| 检查项 | 方法 |
|--------|------|
| Fabric Maven 是否配置 | 检查 repositories 中是否有 maven.fabricmc.net |
| Loom 版本 | 检查 `fabric-loom` 插件版本，应为 `0.10.31` |
| 依赖类型 | API 使用 modApi，实现使用 modImplementation |
| 映射变更 | 执行 `./gradlew clean loom` |
| 版本一致性 | gradle.properties 中的版本与 build.gradle 一致 |
