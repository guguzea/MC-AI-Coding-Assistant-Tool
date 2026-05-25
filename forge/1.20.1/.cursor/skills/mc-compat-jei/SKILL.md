---
name: mc-compat-jei
description: Minecraft Forge JEI/EMI 兼容层。让 JEI/EMI 自动读取 DataGen 配方，或使用现代 API 添加自定义显示。触发词：JEI、EMI、RecipeCategory、jei_plugins、EMI、emi
---

# JEI/EMI 兼容（Forge 1.20.1）

## Decision: 选择兼容方案

```
IF 配方已通过 DataGen 生成
  → JEI/EMI 自动读取 DataPack JSON，无需额外代码（推荐）

IF 需要自定义配方 UI（如 2x2 合成网格、多输入槽）
  → 使用 EMI（EMI 1.0+ 是 JEI 12.x 的现代替代，API 简洁）
  → 或使用 JEI 内置的 CategoryExtension

IF 需要显示子类（sub-categories）
  → EMI.recipeTree() / JEI hideOf() 等插件 API
```

## 方案 A：JEI/EMI 自动读取（DataGen，无代码，最佳）

只要配方通过 `RecipeProvider` 生成到 `src/generated/resources/data/{modid}/recipes/`，JEI 和 EMI 都会在游戏加载时自动发现并显示，**无需任何 JEI/EMI 代码**。

```java
// 在 GatherDataEvent 中注册 RecipeProvider
generator.addProvider(true, new ModRecipeProvider(output, registries));
// 生成的 JSON 文件：src/generated/resources/data/{modid}/recipes/*.json
// JEI/EMI 会自动读取
```

## 方案 B：使用 EMI（现代推荐）

EMI 是 JEI 12.x 的现代替代品，API 简洁，在 Fabric/NeoForge 社区更流行。

### 添加 EMI 依赖

在 `build.gradle` 中：
```groovy
loom {
    // Fabric/NeoForge: modImplementation "dev.emi:EMI:1.0+1.20.1"
    // Forge: fg.deobf "dev.emi:EMI:1.0+1.20.1"
}
```

### 注册 EMI 配方

```java
@Mod.EventBusSubscriber(modid = MOD_ID, bus = Mod.EventBusSubscriber.Bus.MOD, value = Dist.CLIENT)
public class EMIPlugin {
    @SubscribeEvent
    public static void onSetup(EMIModPluginInitEvent event) {
        // EMI 自动读取 DataGen 配方
        // 如需自定义子类：
        event.addCategory(MyEMIRecipeCategory.CATEGORY);
    }
}
```

### EMI 自定义配方类

```java
public class MyEMIRecipe {
    public final ItemStack output;
    public final NonNullList<Ingredient> inputs;

    public MyEMIRecipe(ItemStack output, NonNullList<Ingredient> inputs) {
        this.output = output;
        this.inputs = inputs;
    }
}

public class MyEMIRecipeCategory implements EMIRecipeProvider<MyEMIRecipe> {
    public static final EMIResourceLocation CATEGORY =
        EMIResourceLocation.of(MOD_ID, "my_recipe");

    @Override
    public EMIResourceLocation getId() { return CATEGORY; }

    @Override
    public Component getName() { return Component.literal("My Recipe"); }

    @Override
    public void addRecipes(EMIStackProvider builder) {
        // 添加配方
    }

    @Override
    public int getDisplayHeight() { return 100; }
}
```

## 方案 C：JEI 12.x 插件（传统方式）

JEI 12.x 废弃了 `IRecipeCategory`/`IRecipeWrapper`。现代 JEI 主要通过 DataPack 机制工作，如需自定义显示推荐使用 EMI。

### JEI 插件注册

```java
@Mod.EventBusSubscriber(modid = MOD_ID, value = Dist.CLIENT)
public class JEIPlugin {
    // JEI 12.x 不需要 IRecipeCategory
    // 如需在 JEI 中隐藏/分类配方，使用-jei 的 HideableRecipeCategory 事件
    @SubscribeEvent
    public static void onJEIInit(JeiInitializedEvent event) {
        // JEI 自动读取 DataGen 生成的配方 JSON
    }
}
```

## FluidIngredient（流体配方）

```java
// 流体配方示例（适用于 JEI 和 EMI）
FluidIngredient.of(Fluids.WATER, 1000)  // 1000 mb = 1 桶
// 或标签形式
FluidIngredient.of(FluidTags.WATER, 1000)
```

## 常见错误

- ❌ 手动实现 `IRecipeCategory`/`IRecipeWrapper`（JEI 12.x 已废弃）
- ❌ 在服务端（`Dist.DEDICATED_SERVER`）注册 JEI/EMI（必须 `Dist.CLIENT`）
- ❌ 配方 JSON 放在错误路径（应在 `data/{modid}/recipes/`）
- ❌ DataGen 运行后未刷新 IDE 资源（`./gradlew runData` 后刷新项目）

## 参考资料

- EMI GitHub：https://github.com/emilyploszaj/emi
- EMI 文档：https://emi.pau101.com/
- JEI Wiki（已过时，仅作参考）：https://github.com/mezz/JustEnoughItems/wiki

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-datagen` | DataGen 生成的配方 JSON 自动被 JEI/EMI 读取，无需额外代码 |
| `mc-registry` | 自定义配方类需要注册表引用配方物品/方块 |
