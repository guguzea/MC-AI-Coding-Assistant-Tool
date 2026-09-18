# Yarn Mappings 反模式（Fabric 1.19.4）

## 症状

- 代码中大量出现 `class_XXXXX`、`method_XXXXX`、`field_XXXXX`
- IDE 无法解析方法调用
- 混淆方法名导致开发体验差

## 根因分析

### 1. Yarn 映射未正确应用

**错误配置：**
```groovy
dependencies {
    // ❌ 缺少 v2 后缀
    mappings "net.fabricmc:yarn:1.19.4+build.2"
}
```

**正确配置：**
```groovy
dependencies {
    // ✅ 必须包含 :v2 后缀
    mappings "net.fabricmc:yarn:1.19.4+build.2:v2"
}
```

### 2. 混用 MCP 和 Yarn 映射

**错误代码：**
```java
// ❌ Forge 项目迁移时使用 MCP 风格方法名
EntityPlayerMP player;  // MCP 风格（Forge）
player.sendChatMessage("hello");

// ✅ Fabric 使用 Yarn 映射
ServerPlayerEntity player;  // Yarn 风格（Fabric）
player.sendMessage(Text.literal("hello"));
```

### 3. 误解 class_XXXXX 命名

**错误理解：**
```java
// ❌ class_XXXXX 是未解析的混淆类，不是有效 API
MyClass.class_12345 obj = new MyClass.class_12345();
```

**正确理解：**
- `class_XXXXX` 表示 Yarn 尚未解析的混淆类
- 不应该主动使用这些未解析的类
- 升级 Yarn 版本才可能获得更好的覆盖率；Parchment 是另一套映射基底（叠加在 mojmap 上），补不了 Yarn 未解析的名字

### 4. mapping 版本不匹配

**错误配置：**
```groovy
// ❌ build number 与其他依赖不匹配（本档 scaffold 钉的是 build.2）
mappings "net.fabricmc:yarn:1.19.4+build.1:v2"
```

**正确配置：**
```groovy
// ✅ 使用一致版本
mappings "net.fabricmc:yarn:1.19.4+build.2:v2"
```

### 5. 忘记运行 clean loom

**错误：** 直接 `build` 而不 `clean loom` 导致旧的映射缓存。

**正确方案：**
```bash
./gradlew clean genSources
./gradlew build
```

## Yarn 命名约定参考

| 类型 | 格式 | 示例 |
|------|------|------|
| 已解析类 | PascalCase | `MinecraftClient`、`ItemStack` |
| 已解析方法 | camelCase | `getHealth()`、`setPosition()` |
| 已解析字段 | camelCase | `inventory`、`health` |
| 未解析类 | `class_NNNNN` | `class_12345` |
| 未解析方法 | `method_NNNNN` | `method_12345_a` |
| 未解析字段 | `field_NNNNN` | `field_12345` |

## 可选：改用 Parchment（分层映射）

Parchment 不是 Yarn 的扩展，而是**叠加在 Mojang 官方映射（mojmap）之上**的参数名 + Javadoc 数据。
所以它不能单独当 `mappings`，必须走 Loom 的分层映射；且 Parchment maven 要手动添加
（官方 fabric-docs `develop_loom_options`：「Parchment maven must be manually added. (https://maven.parchmentmc.org)」）：

```groovy
repositories {
    maven { url 'https://maven.parchmentmc.org' }
}

dependencies {
    // ❌ 错误：group / artifact / 版本形态都不对，Parchment zip 不能直接当 mappings
    // mappings "org.parchmentmc:parchment:1.19.4-<日期>@zip"

    // ✅ 正确：group=org.parchmentmc.data，artifact=parchment-<MC 版本>，version=发布日期
    mappings loom.layered() {
        officialMojangMappings()
        parchment("org.parchmentmc.data:parchment-1.19.4:2023.06.26@zip")
    }
}
```

代价：换成分层映射后整套 Yarn 名失效（`MinecraftClient`、`ServerPlayerEntity` 等要按 mojmap 改写），
本档其余 Yarn 示例不再适用。日期必须按本版在 https://maven.parchmentmc.org 上核对，
本包该目录没有数据时不要臆造版本号。
