---
name: mc-compat-jei
description: Minecraft Forge JEI 兼容层。JEI 自动读取数据包配方，或使用 API 添加自定义显示。触发词：JEI、RecipeCategory、jei_plugins
platform: forge
version: "1.14.4"
---

# JEI 兼容（Forge 1.14.4）

## Decision: 选择兼容方案

```
IF 配方已通过数据包 JSON 生成
  → JEI 自动读取数据包 JSON，无需额外代码（推荐）

IF 需要自定义配方 UI（如 2x2 合成网格、多输入槽）
  → 使用 JEI 的 IRecipeCategory / IRecipeWrapper

IF 需要显示子类（sub-categories）
  → JEI hideOf() 等插件 API
```

## 方案 A：JEI 自动读取（数据包，无代码，最佳）

只要配方 JSON 放在 `data/{modid}/recipes/`，JEI 会在游戏加载时自动发现并显示，**无需任何 JEI 代码**。

## 方案 B：使用 JEI 插件（自定义配方）

### 添加 JEI 依赖

在 `build.gradle` 中：
```groovy
dependencies {
    compileOnly fg.deobf("mezz.jei:jei_${minecraft_version}:${jei_version}")
}
```

### 注册 JEI 插件

```java
@Mod.EventBusSubscriber(modid = MOD_ID, value = Dist.CLIENT, bus = Mod.EventBusSubscriber.Bus.MOD)
public class JEIPlugin {
    @SubscribeEvent
    public static void onJeiRegistry(RegistryEvent<IGuiProperties> event) {
        // JEI 插件注册
    }
}
```

## 常见错误

- ❌ 手动实现 `IRecipeCategory`/`IRecipeWrapper` 时使用错误的 API
- ❌ 在服务端（`Dist.DEDICATED_SERVER`）注册 JEI（必须 `Dist.CLIENT`）
- ❌ 配方 JSON 放在错误路径（应在 `data/{modid}/recipes/`）

## 参考资料

- JEI Wiki：https://github.com/mezz/JustEnoughItems/wiki

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-datagen` | 手动编写的配方 JSON 自动被 JEI 读取 |
| `mc-registry` | 自定义配方类需要注册表引用配方物品/方块 |
