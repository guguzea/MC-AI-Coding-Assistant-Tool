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

## 错误：硬编码 Minecraft / Forge 版本号

**症状：** 版本更新时代码失效

```groovy
// ❌ 错误
minecraft "net.minecraftforge:forge:1.18.2-40.1.80"

// ✅ 正确：引用 gradle.properties 中的属性
minecraft "net.minecraftforge:forge:${minecraft_version}-${forge_version}"
```

---

## 错误：forge_version_range 过窄

**症状：** 依赖匹配失败，或需要频繁更新版本号

```properties
# ❌ 错误
forge_version=40.1.80
forge_version_range=[40.1.80,)  # 只匹配这一个版本

# ✅ 正确：匹配所有 40.x 版本
forge_version=40.1.80
forge_version_range=[40,)
```

---

## 错误：copyIdeResources 未启用

**症状：** IDE 中修改资源文件后游戏不加载新内容

```groovy
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
// ✅ 关联 reobfJar
jar {
    manifest { ... }
    finalizedBy 'reobfJar'
}
```

---

## 错误：在 mods.toml 中使用大写 modId

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
// Minecraft 1.18.2 需要 Java 17

// ✅ 必须配置
java.toolchain.languageVersion = JavaLanguageVersion.of(17)
```

---

## Forge 1.18.2 特有：ForgeGradle 版本

```groovy
// ❌ 错误（ForgeGradle 6.x 是 1.20.x 专用）
id 'net.minecraftforge.gradle' version '[6.0,6.2)'

// ✅ 正确（ForgeGradle 5.x 适用于 1.18.2）
id 'net.minecraftforge.gradle' version '[5.1.2,5.2)'
```
