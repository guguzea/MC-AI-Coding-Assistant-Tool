---
name: mc-recipe
description: Minecraft Forge 自定义配方开发。RecipeType、RecipeSerializer、自定义配方实现、Datagen。触发词：Recipe、RecipeType、RecipeSerializer、RecipeProvider
platform: forge
version: "1.15.2"
dependencies: []
mappings: mcp
---

# 自定义配方开发（Forge 1.15.2）

## 快速总览

```
IRecipeType.register(String) → 实现 IRecipe → 注册 RecipeSerializer → DataGen（可选）
```

## 1. 注册 RecipeType

```java
public static final IRecipeType<MyRecipe> MILLING =
    IRecipeType.register(MOD_ID + ":milling");
```

## 2. 实现 Recipe 类

```java
public class MyRecipe implements IRecipe<IInventory> {

    @Override
    public boolean matches(IInventory inv, World world) {
        return input.test(inv.getStackInSlot(0));
    }

    @Override
    public ItemStack getCraftingResult(IInventory inv) {
        return output.copy();  // 必须返回副本
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
    public IRecipeSerializer<?> getSerializer() {
        return ModRecipeSerializers.MY_SERIALIZER.get();
    }

    @Override
    public IRecipeType<?> getType() {
        return ModRecipes.MILLING;
    }

    @Override
    public ResourceLocation getId() {
        return new ResourceLocation(MOD_ID, "my_recipe");
    }
}
```

工作台网格可用 `CraftingInventory`（实现 `IInventory`），**没有** `ICraftingGrid`。

## 3. 注册 RecipeSerializer

```java
public class MyRecipeSerializer implements IRecipeSerializer<MyRecipe> {
    public static final MyRecipeSerializer INSTANCE = new MyRecipeSerializer();

    @Override
    public MyRecipe read(ResourceLocation id, JsonObject json) { ... }

    @Override
    public MyRecipe read(ResourceLocation id, PacketBuffer buf) { ... }

    @Override
    public void write(PacketBuffer buf, MyRecipe recipe) { ... }
}
```

## 常见错误

- ❌ `ICraftingGrid` — 用 `IInventory` / `CraftingInventory`
- ❌ `RecipeType` 写在 DeferredRegister 中 — 用 `IRecipeType.register(String)`
- ❌ `getCraftingResult` 返回原对象而非副本

## 参考资料

- 官方文档：https://docs.minecraftforge.net/en/1.15.2/

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-datagen` | DataGen 生成配方 JSON |
| `mc-blockentity` | 机器方块内处理配方的 tick 逻辑 |
