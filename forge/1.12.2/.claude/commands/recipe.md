# 自定义配方开发（Forge 1.12.2）

## 快速总览

```
实现 IRecipe → 注册配方类型 → 添加到配方管理器
```

## 1. 实现 IRecipe

```java
public class MyRecipe implements IRecipe {
    private final ResourceLocation id;
    private final Ingredient input;
    private final ItemStack output;

    @Override
    public boolean matches(InventoryCrafting inv, World world) {
        return input.apply(inv.getStackInSlot(0));
    }

    @Override
    public ItemStack getCraftingResult(InventoryCrafting inv) {
        return output.copy();
    }

    @Override
    public ItemStack getRecipeOutput() {
        return output.copy();
    }

    @Override
    public ResourceLocation getId() { return id; }
}
```

## 2. 在 FMLInitializationEvent 中注册

```java
@Mod.EventHandler
public void init(FMLInitializationEvent event) {
    RecipeSorter.register(MOD_ID + ":my_recipe", MyRecipe.class,
        RecipeSorter.Category.SHAPELESS, "after:minecraft:shapeless");
}
```

## 常见错误

- ❌ `getCraftingResult` 返回原对象而非副本

## 参考资料

- 详细示例：参见 `03-item.mdc`
