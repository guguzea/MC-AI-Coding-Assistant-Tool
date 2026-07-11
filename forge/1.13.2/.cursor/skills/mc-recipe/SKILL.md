---
name: mc-recipe
description: Minecraft Forge 自定义配方开发。RecipeType、RecipeSerializer、自定义配方。触发词：Recipe、RecipeType、RecipeSerializer
platform: forge
version: "1.13.2"
dependencies: []
mappings: mcp
---

# 自定义配方开发（Forge 1.13.2）

## 快速总览

```
注册 RecipeType（静态） → 实现 Recipe 类 → 注册 RecipeSerializer（静态） → JSON
```

## 1. 注册 RecipeType

```java
public static final RecipeType<MyRecipe> MILLING =
    RecipeType.register(MOD_ID + ":milling");
```

## 2. 实现 Recipe 类

```java
public class MyRecipe extends RecipeSerializer<MyRecipe> implements IRecipe<IRecipeLayout> {
    private Ingredient input;
    private ItemStack output;
    private int processingTime;

    @Override
    public void serialize(@Nonnull @WillNotReturn NBTCompoundNBT data) {
        // 序列化
    }

    @Override
    public void deserialize(@Nonnull NBTCompoundNBT data) {
        // 反序列化
    }

    @Override
    public IRecipeType<?> getType() {
        return MILLING;
    }
}
```

## 常见错误

- ❌ RecipeType 写在 RegistryEvent 中 → 不支持，必须用 `RecipeType.register()`

## 参考资料

- Forge 官方文档：https://docs.minecraftforge.net/en/1.13.2/
