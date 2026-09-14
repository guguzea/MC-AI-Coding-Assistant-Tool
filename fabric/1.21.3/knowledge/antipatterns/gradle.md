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
    id 'fabric-loom' version '1.8'  // ✅ 与本档 scaffold/build.gradle:2 同值；旧写法 1.3-SNAPSHOT 是 1.20.1 模板残留
}
```

### 3. 混用 modImplementation 和 modApi

**错误配置：**
```groovy
dependencies {
    // ❌ Fabric API 应该使用 modApi（需要传递依赖）
    modImplementation "net.fabricmc.fabric-api:fabric-api:0.110.0+1.21.3"
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
fabric_api_version=0.110.0+1.21.3
```

### 6. accessWidener 路径错误

> 更正（F185，2026-09-13）：本节原先的 ❌ / ✅ 两段代码逐字节相同，示例等于没写；「相对路径是错的」这个断言也不成立——`file("src/main/resources/…")` 正是官方写法。真正会踩的坑是**成对声明缺一半**，下面按这个口径重写（标题保留原样以免打乱本节编号）。

**错误配置：**
```groovy
// build.gradle：只声明了 loom 这一半
loom {
    accessWidenerPath = file("src/main/resources/examplemod.accesswidener")  // ❌ fabric.mod.json 里没有配对的 "accessWidener" 键 → AW 不生效
}
```

**正确配置：**
```groovy
// build.gradle：相对路径本身就是官方写法
loom {
    accessWidenerPath = file("src/main/resources/examplemod.accesswidener")  // ✅ 与下面的键成对
}
```

```json
// fabric.mod.json —— 必须与上面成对；该键只存在于 fabric.mod.json，不要写进 *.mixins.json
{
  "accessWidener": "examplemod.accesswidener"
}
```

## 诊断清单

| 检查项 | 方法 |
|--------|------|
| Fabric Maven 是否配置 | 检查 repositories 中是否有 maven.fabricmc.net |
| Loom 版本 | 检查 `fabric-loom` 插件版本，本档取 scaffold/build.gradle:2 的 `1.8`（裸 `1.8` 能否解析见 未核实 项）|
| 依赖类型 | API 使用 modApi，实现使用 modImplementation |
| 映射变更 | 执行 `./gradlew clean loom` |
| 版本一致性 | gradle.properties 中的版本与 build.gradle 一致 |
| AW 成对声明 | `loom.accessWidenerPath` 与 fabric.mod.json 的 `"accessWidener"` 键必须同时存在（见 §6）|
| Java 版本 | 1.21.x 必须使用 **Java 21** |
