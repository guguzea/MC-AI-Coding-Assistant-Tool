# Gradle/Loom 构建反模式（Fabric 1.18.2）

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

### 2. Loom 版本与 Gradle 不配套

> 注：**Loom 的 `1.0` 线不是「版本过低」**——1.0 的线号高于 0.14，真正的约束是它要求配套 Gradle 8（见 `scaffold/gradle/wrapper/gradle-wrapper.properties:3`「Loom 1.0.18 配对 Gradle 8」）。本档目前并存两个 Loom 钉值：文档正文写 `0.14.46`（`.cursor/rules/00-project-setup.mdc:107`），而真机构建用的 scaffold 钉 `1.0.18`（`scaffold/build.gradle:2` + Gradle 8.4 wrapper）；`knowledge/version-changes/1.18.x.md` 旧稿的 `0.11.x` 在本档无任何佐证、已删。哪个是本档正解需用户定夺，勿把两者当成同一个值互相「修正」。

**错误配置：**
```groovy
plugins {
    id 'fabric-loom' version '1.0'  // ❌ 不完整版本串 + 未配套 Gradle 8（不是「版本过低」）
}
```

**正确配置：**
```groovy
plugins {
    id 'fabric-loom' version '0.14.46'  // ✅ 本档文档正文钉值（scaffold 实钉 1.0.18，见上方注）
}
```

### 3. 混用 modImplementation 和 modApi

**错误配置：**
```groovy
dependencies {
    // ❌ Fabric API 应该使用 modApi（需要传递依赖）
    modImplementation "net.fabricmc.fabric-api:fabric-api:0.77.0+1.18.2"
}
```

**正确配置：**
```groovy
dependencies {
    // ✅ Fabric API 使用 modApi
    modApi "net.fabricmc.fabric-api:fabric-api:0.77.0+1.18.2"
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
minecraft_version=1.20.4
```

**正确配置：**
```properties
# ✅ 与 build.gradle 中的 minecraft 依赖一致
minecraft_version=1.18.2
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
| Loom 版本 | 检查 `fabric-loom` 插件版本 |
| 依赖类型 | API 使用 modApi，实现使用 modImplementation |
| 映射变更 | 执行 `./gradlew clean genSources` |
| 版本一致性 | gradle.properties 中的版本与 build.gradle 一致 |
