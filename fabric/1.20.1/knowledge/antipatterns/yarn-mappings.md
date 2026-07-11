# Yarn Mappings 反模式（Fabric 1.20.1）

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
    mappings "net.fabricmc:yarn:1.20.1+build.10"
}
```

**正确配置：**
```groovy
dependencies {
    // ✅ 必须包含 :v2 后缀
    mappings "net.fabricmc:yarn:1.20.1+build.10:v2"
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
- 升级 Yarn 版本或使用 Parchment 可能获得更好的覆盖率

### 4. mapping 版本不匹配

**错误配置：**
```groovy
// ❌ build number 与其他依赖不匹配
mappings "net.fabricmc:yarn:1.20.1+build.5:v2"
```

**正确配置：**
```groovy
// ✅ 使用一致版本
mappings "net.fabricmc:yarn:1.20.1+build.10:v2"
```

### 5. 忘记运行 clean loom

**错误：** 直接 `build` 而不 `clean loom` 导致旧的映射缓存。

**正确方案：**
```bash
./gradlew clean loom
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

## 升级到 Parchment（推荐）

Parchment 在 Yarn 基础上添加了参数名和 Javadoc：

```groovy
dependencies {
    // ✅ 使用 Parchment（Maven: parchmentmc.org）
    mappings "org.parchmentmc:parchment:1.20.1-2023.09.03@zip"
}
```
