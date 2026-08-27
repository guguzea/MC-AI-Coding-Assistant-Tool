# Gradle 构建相关反模式

## ❌ 硬编码版本号

```properties
# 错误：在 build.gradle 中硬编码
minecraft "net.minecraftforge:forge:1.13.2-25.0.219"
```

**正确方案**：在 gradle.properties 中定义，build.gradle 中引用

```properties
# gradle.properties
minecraft_version=1.13.2
forge_version=25.0.219
```

```groovy
# build.gradle
dependencies {
    minecraft "net.minecraftforge:forge:${minecraft_version}-${forge_version}"
}
```

---

## ❌ 使用错误的 Forge 版本号

Forge 1.13.2 对应 Forge 25.x.x，不是 47.x.x。

```properties
# 错误
forge_version=47.2.0  // ❌ 这是 1.20.1 的版本号

# 正确
forge_version=25.0.219  // ✅ 1.13.2 对应 25.x.x
```

---

## ❌ 使用 Java 17

Forge 1.13.2 需要 Java 8。

```groovy
# 错误
java.toolchain.languageVersion = JavaLanguageVersion.of(17)  // ❌ 不兼容

# 正确
java.toolchain.languageVersion = JavaLanguageVersion.of(8)  // ✅
```
