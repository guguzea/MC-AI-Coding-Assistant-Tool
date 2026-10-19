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
数据包 JSON + 实现 IRecipe → 注册 RecipeSerializer（RegistryEvent.Register<IRecipeSerializer<?>> + event.getRegistry().register(...)；本档无 DeferredRegister）
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
// 本档构件核实（javap @ forge-1.13.2-25.0.223_mapped_snapshot_20180921-1.13）：
//   IRecipe 是**非泛型**接口：public interface IRecipe extends IForgeRecipe
//   （泛型形参是 1.14+ 才加的；本档写 IRecipe<IInventory> 会报 type IRecipe does not take parameters）
public class MyRecipe implements IRecipe {
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

  // 1.13.2 构件 javap：IRecipe **没有** getType()（IRecipeType 是 1.14 起的体系）；本档配方按 serializer 注册

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
