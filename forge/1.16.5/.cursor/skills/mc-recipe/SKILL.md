---
name: mc-recipe
description: Minecraft Forge 自定义配方开发。RecipeType、RecipeSerializer，自定义配方实现。触发词：Recipe、RecipeType、RecipeSerializer、RecipeProvider、IIngredient
platform: forge
version: "1.16.5"
dependencies: []
mappings: parchment
---

# 自定义配方开发（Forge 1.16.5）

## 快速总览

```
注册 RecipeType（静态） → 实现 Recipe 类 → 注册 RecipeSerializer（静态） → DataGen（可选）
```

## 1. 注册 RecipeType

`RecipeType` 不支持 `DeferredRegister`，使用**静态注册**：

```java
public static final RecipeType<MyRecipe> MILLING =
    RecipeType.register(MOD_ID + ":milling");
```

## 2. 实现 Recipe 类

```java
public class MyRecipe implements IRecipe<CraftingContainer> {

    @Override
    public boolean matches(CraftingContainer inv, World world) {
        return input.test(inv.getStack(0));
    }

    @Override
    public ItemStack getCraftingResult(CraftingContainer inv) {
        return output.copy();
    }

    @Override
    public boolean canFit(int width, int height) {
        return width * height >= 1;
    }

    @Override
    public IRecipeSerializer<?> getSerializer() {
        return MyRecipeSerializer.INSTANCE;
    }
}
```

> `getCraftingResult` **必须返回副本**（`output.copy()`），否则同一个 ItemStack 实例被修改会影响原配方。

## 3. 注册 RecipeSerializer

`RecipeSerializer` 使用**静态注册**：

```java
// ModRecipeSerializers.java
public static final RegistryObject<RecipeSerializer<MyRecipe>> MY_SERIALIZER =
    RECIPE_SERIALIZERS.register("my_recipe",
        () -> MyRecipeSerializer.INSTANCE
    );

// MyRecipeSerializer.java
public class MyRecipeSerializer extends RecipeSerializer<MyRecipe> {
    public static final MyRecipeSerializer INSTANCE = new MyRecipeSerializer();

    @Override
    public MyRecipe read(ResourceLocation id, JsonObject json) {
        Ingredient input = Ingredient.fromJson(json.get("input"));
        ItemStack output = ShapedRecipe.getItemFromJson(json.getAsJsonObject("output"));
        int time = JSONUtils.getInt(json, "processingTime", 200);
        return new MyRecipe(id, input, output, time);
    }

    @Override
    public MyRecipe read(ResourceLocation id, PacketBuffer buf) {
        Ingredient input = Ingredient.read(buf);
        ItemStack output = buf.readItem();
        int time = buf.readVarInt();
        return new MyRecipe(id, input, output, time);
    }

    @Override
    public void write(PacketBuffer buf, MyRecipe recipe) {
        recipe.input.toNetwork(buf);
        buf.writeItem(recipe.output);
        buf.writeVarInt(recipe.processingTime);
    }
}
```

## 4. 配方 JSON 格式

```json
{
  "type": "mymod:my_recipe",
  "input": { "item": "minecraft:diamond" },
  "output": { "item": "mymod:processed_diamond", "count": 2 },
  "processingTime": 400
}
```

- `"type"` 必须与 `RecipeSerializer` 注册名一致

## 常见错误

- ❌ `Ingredient.fromJson` 参数不是数组（单物品时用对象）→ `{ "item": "..." }` 或 `[{ "item": "..." }`
- ❌ `getCraftingResult` 返回原对象而非副本 → 多个配方实例共享同一 ItemStack
- ❌ `RecipeType` 写在 DeferredRegister 中 → 不支持，必须用 `RecipeType.register()`
- ❌ `RecipeSerializer` 忘了在 mod 初始化时调用 → 配方无法被加载

## 参考资料

- 官方文档：https://docs.minecraftforge.net/en/1.16.5/

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-datagen` | DataGen 生成配方 JSON |
| `mc-networking` | 配方相关网络同步 |
| `mc-blockentity` | 机器方块内处理配方的 tick 逻辑 |
