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
数据包 JSON + 实现 IRecipe → 注册 RecipeSerializer（DeferredRegister）
```

1.13.2 **没有** `RecipeType.register()`。自定义类型在 `IRecipe#getType()` 返回静态 `IRecipeType` 实例。

## 1. 数据包 JSON

```json
{
  "type": "mymod:my_recipe",
  "ingredient": { "item": "minecraft:diamond" },
  "result": { "item": "mymod:processed_diamond", "count": 2 }
}
```

## 2. 实现 IRecipe 类（stub）

```java
public class MyRecipe implements IRecipe<IInventory> {
  private Ingredient input;
  private ItemStack output;

  @Override
  public boolean matches(IInventory inv, World world) {
    return input.test(inv.getStackInSlot(0));
  }

  @Override
  public ItemStack getCraftingResult(IInventory inv) {
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
  public IRecipeSerializer<?> getSerializer() {
    return ModRecipeSerializers.MY_SERIALIZER.get();
  }

  @Override
  public IRecipeType<?> getType() {
    return ModRecipes.MY_TYPE;
  }

  @Override
  public ResourceLocation getId() {
    return new ResourceLocation(MOD_ID, "my_recipe");
  }
}
```

## 3. RecipeSerializer（NBTTagCompound）

自定义 Serializer 的 NBT 读写用 `NBTTagCompound`，不是 `NBTCompoundNBT` / `CompoundNBT`。

```java
@Override
public MyRecipe read(ResourceLocation id, PacketBuffer buf) {
  NBTTagCompound tag = buf.readCompoundTag();
  // 从 tag 反序列化 input / output
}
```

## 常见错误

- ❌ `RecipeType.register()` — 1.13.2 不支持
- ❌ `NBTCompoundNBT` / `IRecipeLayout` — 假 API；按上文 stub 对照 javadoc
- ❌ RecipeSerializer 继承 `Recipe` — Serializer 实现 `IRecipeSerializer<T>`

## 参考资料

- Forge 官方文档：https://docs.minecraftforge.net/en/1.13.2/
