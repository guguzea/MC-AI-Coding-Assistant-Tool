# Gradle 构建反模式

## 错误：Java 版本不兼容

**症状：** `UnsupportedClassVersionError` 或编译错误

```groovy
// ❌ 错误（Java 9+）
sourceCompatibility = '9'
targetCompatibility = '9'

// ✅ 正确（Java 8）
sourceCompatibility = '1.8'
targetCompatibility = '1.8'
```

---

## 错误：forge_version 不匹配

**症状：** 依赖解析失败

```properties
# ❌ 错误
mc_version=1.12.2
forge_version=14.23.5.2847  # ✅ 正确

# ✅ 正确：Forge 版本对应 MC 1.12.2
mc_version=1.12.2
forge_version=14.23.5.2847
```

Forge 1.12.2 对应 Forge 14.23.5.x 版本。

---

## 错误：在 mods.toml 中使用大写 modId（新版 Forge）

> 注意：Forge 1.12.2 使用 `mcmod.info`，不是 `mods.toml`。

```json
// mcmod.info
{
  "modid": "examplemod"   // ✅ 全部小写
}
```

---

## 错误：reobfJar 未关联

**症状：** 发布时 jar 文件仍然混淆

```groovy
// ✅ 正确
jar {
    manifest { ... }
    finalizedBy 'reobfJar'
}
```
