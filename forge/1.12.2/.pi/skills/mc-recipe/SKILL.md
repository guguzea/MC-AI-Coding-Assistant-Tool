---
name: mc-recipe
description: Minecraft Forge 自定义配方开发。RecipeType、RecipeSerializer、自定义配方实现。触发词：Recipe、RecipeType、RecipeSorter、IRecipe
platform: forge
version: "1.12.2"
dependencies: []
mappings: mcp
---

# 自定义配方开发（Forge 1.12.2）

## 快速总览

```
实现 IRecipe → RecipeSorter.register → JSON 或代码注册
```

## 1. 实现 IRecipe 类

```java
public class MyRecipe implements IRecipe {
    private final Ingredient input;
    private final ItemStack output;

    public MyRecipe(Ingredient input, ItemStack output) {
        this.input = input;
        this.output = output;
    }

    @Override
    public boolean matches(InventoryCrafting inv, World world) {
        return input.apply(inv.getStackInSlot(0));
    }

    @Override
    public ItemStack getCraftingResult(InventoryCrafting inv) {
        return output.copy();
    }

    @Override
    public boolean canFit(int width, int height) {
        return width * height >= 1;
    }

    @Override
    public ItemStack getRecipeOutput() {
        return output.copy();
    }
}
```

## 2. 注册自定义配方类型

```java
@Mod.EventHandler
public void init(FMLInitializationEvent event) {
    RecipeSorter.register(MOD_ID + ":my_recipe", MyRecipe.class, RecipeSorter.Category.SHAPELESS, "after:minecraft:shapeless");
}
```

## 常见错误

- ❌ `getCraftingResult` 返回原对象而非副本
- ❌ `matches()` 不正确实现
- ❌ 使用 1.13+ 的 `IRecipeSerializer` / `RecipeType.register` / `getId()` — 1.12 只有上述四个 `IRecipe` 方法

## 参考资料

- Minecraft Wiki: https://minecraft.wiki/w/Custom_recipes
- 详细示例：参见 `03-item.mdc`

## 扩展点

| 配合 Skill | 协作说明 |
|------------|---------|
| `mc-item` | 配方输出物品 |
| `mc-block` | 工作台方块 |
