---
name: mc-compat-jei
description: Minecraft Forge JEI/EMI 兼容层。让 JEI/EMI 自动读取 DataGen 配方，或使用 API 添加自定义显示。触发词：JEI、EMI、RecipeCategory、jei_plugins
---

# JEI 兼容（Forge 1.16.5）

## Decision: 选择兼容方案

```
IF 配方已通过 DataGen 生成
  → JEI/EMI 自动读取 DataPack JSON，无需额外代码（推荐）

IF 需要自定义配方 UI（如 2x2 合成网格、多输入槽）
  → 使用 JEI 内置的 IRecipeCategory / IRecipeWrapper

IF 需要显示子类（sub-categories）
  → JEI hideOf() 等插件 API
```

## 方案 A：JEI 自动读取（DataGen，无代码，最佳）

只要配方通过 `RecipeProvider` 生成到 `src/generated/resources/data/{modid}/recipes/`，JEI 会在游戏加载时自动发现并显示，**无需任何 JEI 代码**。

```java
// 在 GatherDataEvent 中注册 RecipeProvider
generator.addProvider(new ModRecipeProvider(output, MOD_ID));
// 生成的 JSON 文件：src/generated/resources/data/{modid}/recipes/*.json
// JEI 会自动读取
```

## 方案 B：JEI 插件（传统方式）

### 添加 JEI 依赖

在 `build.gradle` 中：
```groovy
minecraft {
    runs {
        client {
            modLoader = "jei"
            loader = "jei"
        }
    }
}

dependencies {
    deobfCompile "mezz.jei:jei_${minecraft_version}:${jei_version}"
}
```

### JEI 插件注册

```java
@Mod.EventBusSubscriber(modid = MOD_ID, value = Dist.CLIENT)
public class JEIPlugin {
    @SubscribeEvent
    public static void registerCategories(RegistryEvent.NewRegistry event) {
        // JEI 12.x 不需要 IRecipeCategory
        // 如需在 JEI 中隐藏/分类配方，使用 JEI 的 HideableRecipeCategory 事件
    }
}
```

## FluidIngredient（流体配方）

```java
// 流体配方示例（适用于 JEI）
FluidIngredient.of(Fluids.WATER, 1000)  // 1000 mb = 1 桶
// 或标签形式
FluidIngredient.of(FluidTags.WATER, 1000)
```

## 常见错误

- ❌ 在服务端（`Dist.DEDICATED_SERVER`）注册 JEI（必须 `Dist.CLIENT`）
- ❌ 配方 JSON 放在错误路径（应在 `data/{modid}/recipes/`）
- ❌ DataGen 运行后未刷新 IDE 资源（`./gradlew runData` 后刷新项目）

## 参考资料

- JEI Wiki：https://github.com/mezz/JustEnoughItems/wiki

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-datagen` | DataGen 生成的配方 JSON 自动被 JEI 读取，无需额外代码 |
| `mc-registry` | 自定义配方类需要注册表引用配方物品/方块 |
