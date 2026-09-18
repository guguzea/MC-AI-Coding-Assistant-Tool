# Gradle/Loom 构建反模式（Fabric 1.19.4）

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
    id 'fabric-loom' version '0.14-SNAPSHOT'  // ❌ 该钉值不存在（见下）
}
```

**正确配置：**
```groovy
plugins {
    id 'fabric-loom' version '1.0.18'  // ✅ 与本档 scaffold/build.gradle:2 实值一致
}
```

> 证据：`https://maven.fabricmc.net/net/fabricmc/fabric-loom/maven-metadata.xml` 的 SNAPSHOT 序列
> 从 `0.13-SNAPSHOT` 直接跳到 `1.0-SNAPSHOT`，**没有 `0.14-SNAPSHOT`**（旧稿把它写成「1.19.x 推荐」，
> 属虚构钉值）；同文件含 `1.0.1`–`1.0.18`。本档 `scaffold/build.gradle:2` 钉 `1.0.18`，
> `scaffold/gradle/wrapper/gradle-wrapper.properties:3` 注明「Loom 1.0.18 配对 Gradle 8」。
> 另：裸写 `version '1.0'` 也不在 metadata 中（只有 `1.0-SNAPSHOT` 与 `1.0.x`），不要当钉值用。

### 3. 混用 modImplementation 和 modApi

**错误配置：**
```groovy
dependencies {
    // ❌ Fabric API 应该使用 modApi（需要传递依赖）
    modImplementation "net.fabricmc.fabric-api:fabric-api:${project.fabric_api_version}"  // ❌ 不要：需要传递时用 modApi；也不要 net.fabric.sdk
}
```

**正确配置：**
```groovy
dependencies {
    // ✅ Fabric API 使用 modApi（需要传递依赖给其他 mod）
    modApi "net.fabricmc.fabric-api:fabric-api:0.87.2+1.19.4"
    // ✅ 第三方 mod 使用 modImplementation
    modImplementation "com.example:third-party:1.0.0"
}
```

### 4. 忘记 clean loom

**错误：** 映射变更后直接 build。

**正确方案：**
```bash
./gradlew clean genSources
```

### 5. gradle.properties 版本号不一致

**错误配置：**
```properties
# ❌ minecraft_version 和实际使用不一致
minecraft_version=1.19.4
```

**正确配置：**
```properties
# ✅ 与 build.gradle 中的 minecraft 依赖一致
minecraft_version=1.19.4
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
| Loom 版本 | 检查 `fabric-loom` 插件版本（本档应为 `1.0.18`，见上「2. Loom 版本不兼容」）|
| 依赖类型 | API 使用 modApi，实现使用 modImplementation |
| 映射变更 | 执行 `./gradlew clean genSources` |
| 版本一致性 | gradle.properties 中的版本与 build.gradle 一致 |
