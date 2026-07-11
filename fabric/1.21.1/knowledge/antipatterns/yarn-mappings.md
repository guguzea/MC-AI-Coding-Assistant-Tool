# Yarn 映射相关反模式

## ❌ 误解未解析的命名

**症状**：代码中出现 `class_XXXXX`、`method_XXXXX`、`field_XXXXX`

**原因**：
- Yarn 映射不完整，尚未为该成员分配可读名称
- 或者正在使用 MCP 映射（不兼容）

**解决方案**：
1. 这是正常现象，不需要修改
2. 如果确实需要访问该成员，通过 Mixin Access Widener 访问
3. 不要试图直接使用 `class_XXXXX` 等命名

```java
// ❌ 错误
@Shadow private static Object class_12345;  // 不要使用未解析的命名

// ✅ 正确
@Shadow private static MinecraftClient instance;  // 使用已解析的名称
```

## ❌ 混用 Yarn 和 MCP 映射

**症状**：编译错误，类/方法找不到

**原因**：
- 项目使用 Yarn 映射，但代码中使用了 MCP 命名风格
- 或者相反

**解决方案**：
1. 确认项目使用的映射类型（检查 `build.gradle` 中的 `mappings` 配置）
2. 使用对应映射的工具重新生成开发环境
3. 如果从 Forge 迁移，不要复制 MCP 命名的代码

```groovy
// build.gradle 中确认映射类型
mappings "net.fabricmc:yarn:${project.yarn_mappings}:v2"  // Yarn
// vs
mappings "net.minecraftforge:fmllabels:${minecraft_version}"  // MCP（Forge）
```

## ❌ 使用 Mojang 混淆名

**症状**：IDE 中无法找到类或方法

**原因**：直接使用了 Minecraft 服务端的混淆名（`func_XXXXX`、`class_XXXXX`）

**解决方案**：使用 Yarn 映射后的可读名称

```java
// ❌ 错误
player.func_12345("message");  // Mojang 混淆名

// ✅ 正确
player.sendMessage(Text.literal("message"));  // Yarn 可读名
```

## ❌ 混淆类和成员

**症状**：Mixin 中 `@Shadow` 找不到成员

**原因**：
- 成员名拼写错误
- 使用了错误的映射版本
- 成员已被移除或重命名

**解决方案**：
1. 在 IDE 中使用自动补全确认正确名称
2. 检查 `build.gradle` 中的 mappings 版本
3. 查看 [Yarn 仓库](https://github.com/FabricMC/yarn) 获取最新映射

## ❌ 手动编辑映射

**症状**：修改被覆盖

**原因**：映射由 Loom 自动管理，手动修改会被覆盖

**解决方案**：
1. 不要手动修改 `build/cache/minecraft-prod.jar` 或其内容
2. 如需扩展映射，使用 Access Widener
