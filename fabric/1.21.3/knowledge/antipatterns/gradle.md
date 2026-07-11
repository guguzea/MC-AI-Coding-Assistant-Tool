# Gradle/Loom 构建反模式（Fabric 1.21.3）

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
    id 'fabric-loom' version '1.0'  // ❌ 版本过低
}
```

**正确配置：**
```groovy
plugins {
    id 'fabric-loom' version '1.3-SNAPSHOT'  // ✅ 1.21.x 推荐
}
```

### 3. 混用 modImplementation 和 modApi

**错误配置：**
```groovy
dependencies {
    // ❌ Fabric API 应该使用 modApi（需要传递依赖）
    modImplementation "net.fabricmc.fabric-api:fabric-api:0.200.1+build.3"
}
```

**正确配置：**
```groovy
dependencies {
    // ✅ Fabric API 使用 modApi
    modApi "net.fabricmc.fabric-api:fabric-api:${project.fabric_api_version}"
    // ✅ 第三方 mod 使用 modImplementation
    modImplementation "com.example:third-party:1.0.0"
}
```

### 4. 忘记 clean loom

**错误：** 映射变更后直接 build。

**正确方案：**
```bash
./gradlew clean loom
```

### 5. gradle.properties 版本号不一致

**错误配置：**
```properties
# ❌ minecraft_version 和实际使用不一致
minecraft_version=1.20.4
```

**正确配置：**
```properties
# ✅ 与 build.gradle 中的 minecraft 依赖一致
minecraft_version=1.21.3
yarn_mappings=1.21.3+build.2
loader_version=0.16.9
fabric_api_version=0.200.1+build.3
```

### 6. accessWidener 路径错误

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
| Loom 版本 | 检查 `fabric-loom` 插件版本（1.3-SNAPSHOT for 1.21.x）|
| 依赖类型 | API 使用 modApi，实现使用 modImplementation |
| 映射变更 | 执行 `./gradlew clean loom` |
| 版本一致性 | gradle.properties 中的版本与 build.gradle 一致 |
| Java 版本 | 1.21.x 必须使用 **Java 21** |
