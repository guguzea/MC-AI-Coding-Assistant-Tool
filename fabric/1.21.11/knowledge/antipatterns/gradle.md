# Gradle/Loom 构建反模式（Fabric 1.21.11）

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
    id 'fabric-loom' version '1.0'  // ❌ 版本过低；且 1.21.11 起官方模板的插件 id 已不是 fabric-loom
}
```

**正确配置：**
```groovy
plugins {
    // ✅ 与本档 scaffold/build.gradle:5 + gradle.properties:13(loom_version) 同值
    id 'net.fabricmc.fabric-loom-remap' version '1.17-SNAPSHOT'
}
```

### 3. 混用 modImplementation 和 modApi

**错误配置：**
```groovy
dependencies {
    // ❌ Fabric API 需要传递依赖，modImplementation 不会传递
    modImplementation "net.fabricmc.fabric-api:fabric-api:0.141.6+1.21.11"
}
```

**正确配置：**
```groovy
dependencies {
    // ✅ Fabric API 使用 modApi（注意 1.21.x 使用 net.fabricmc.fabric-api）
    modApi "net.fabricmc.fabric-api:fabric-api:0.141.6+1.21.11"
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
# ❌ 值是从别的版本档复制来的残留，build.gradle 依赖的却是 ${project.minecraft_version}=1.21.11
minecraft_version=1.21.4
yarn_mappings=1.21.11+build.6
```

**正确配置：**
```properties
# ✅ 与 build.gradle 中的 minecraft 依赖一致；下列四行与本档 scaffold/gradle.properties:10-13 同值（钉值以 scaffold 为准）
minecraft_version=1.21.11
yarn_mappings=1.21.11+build.6
loader_version=0.19.3
loom_version=1.17-SNAPSHOT
```

### 6. accessWidener 路径错误

> 更正（F185，2026-09-13）：本节原先的 ❌ / ✅ 两段代码逐字节相同，示例等于没写；「相对路径是错的」这个断言也不成立——本档 `.cursor/rules/00-project-setup.mdc:123` 与语料 `fabric-docs/1.21.11/processed/develop_loom_options.md:21` 用的都是 `file("src/main/resources/…")`。真正会踩的坑是**成对声明缺一半**，下面按这个口径重写（标题保留原样以免打乱本节编号）。

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
// 语料实证：fabric-docs/1.21.11/processed/develop_class-tweakers_index.md:69 就在 fabric.mod.json 里写 "accessWidener"
{
  "accessWidener": "examplemod.accesswidener"
}
```

## 诊断清单

| 检查项 | 方法 |
|--------|------|
| Fabric Maven 是否配置 | 检查 repositories 中是否有 maven.fabricmc.net |
| Loom 版本 | 本档插件 id 是 `net.fabricmc.fabric-loom-remap`，版本取 scaffold 的 `loom_version=1.17-SNAPSHOT`（见 §2、rules/00:109）|
| 依赖类型 | API 使用 modApi，实现使用 modImplementation |
| Fabric API 坐标 | 使用 `net.fabricmc.fabric-api:fabric-api`（不是 `net.fabric.sdk`） |
| 映射变更 | 执行 `./gradlew clean loom` |
| 版本一致性 | gradle.properties 中的版本与 build.gradle 一致 |
