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
实现 IRecipe → 注册配方类型 → 添加到配方管理器
```

## 1. 实现 IRecipe 类

```java
public class MyRecipe implements IRecipe {
    private final ResourceLocation id;
    private final Ingredient input;
    private final ItemStack output;
    private final int processingTime;

    public MyRecipe(ResourceLocation id, Ingredient input, ItemStack output, int time) {
        this.id = id;
        this.input = input;
        this.output = output;
        this.processingTime = time;
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

    @Override
    public ResourceLocation getId() {
        return id;
    }

    @Override
    public IRecipeSerializer<?> getSerializer() {
        return ModRecipeSerializers.MY_RECIPE;
    }

    @Override
    public IRecipeType<?> getType() {
        return ModRecipeTypes.MY_TYPE;
    }
}
```

## 2. 注册配方类型

```java
public static final RecipeType<IRecipe> MY_TYPE =
    RecipeType.register(MOD_ID + ":my_recipe");
```

## 3. 在 FMLInitializationEvent 中注册配方

```java
@Mod.EventHandler
public void init(FMLInitializationEvent event) {
    RecipeSorter.register(MOD_ID + ":my_recipe", MyRecipe.class, RecipeSorter.Category.SHAPELESS, "after:minecraft:shapeless");
}
```

## 常见错误

- ❌ `getCraftingResult` 返回原对象而非副本
- ❌ `matches()` 不正确实现

## 参考资料

- Minecraft Wiki: https://minecraft.wiki/w/Custom_recipes
- 详细示例：参见 `03-item.mdc`

## 扩展点

| 配合 Skill | 协作说明 |
|------------|---------|
| `mc-item` | 配方输出物品 |
| `mc-block` | 工作台方块 |
