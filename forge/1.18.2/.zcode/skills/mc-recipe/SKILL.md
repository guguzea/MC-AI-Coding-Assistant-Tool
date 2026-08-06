---
name: mc-recipe
description: Minecraft Forge 自定义配方开发。RecipeType、RecipeSerializer、自定义配方实现、Datagen。触发词：Recipe、RecipeType、RecipeSerializer、RecipeProvider、ProcessingRecipe、Ingredient
platform: forge
version: "1.18.2"
dependencies: []
mappings: parchment
---

# 自定义配方开发（Forge 1.18.2）

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
public class MyRecipe implements Recipe<Container> {
    private final ResourceLocation id;
    private final Ingredient input;
    private final ItemStack output;
    private final int processingTime;

    public MyRecipe(ResourceLocation id, Ingredient input, ItemStack output, int processingTime) {
        this.id = id;
        this.input = input;
        this.output = output;
        this.processingTime = processingTime;
    }

    @Override
    public boolean matches(Container container, Level level) {
        return input.test(container.getItem(0));
    }

    @Override
    public ItemStack assemble(Container container, RegistryAccess access) {
        return output.copy();  // 必须返回副本！
    }

    @Override
    public ItemStack getResultItem(RegistryAccess access) {
        return output.copy();
    }

    @Override
    public ResourceLocation getId() {
        return id;
    }

    @Override
    public RecipeType<?> getType() {
        return ModRecipes.MILLING;
    }

    @Override
    public RecipeSerializer<?> getSerializer() {
        return ModRecipeSerializers.MY_SERIALIZER.get();
    }
}
```

> `assemble` 和 `getResultItem` **必须返回副本**（`output.copy()`），否则同一个 ItemStack 实例被修改会影响原配方。

## 3. 注册 RecipeSerializer

`RecipeSerializer` 同样使用**静态注册**：

```java
public static final RegistryObject<RecipeSerializer<MyRecipe>> MY_SERIALIZER =
    RECIPE_SERIALIZERS.register("my_recipe",
        () -> MyRecipeSerializer.INSTANCE
    );

public class MyRecipeSerializer implements RecipeSerializer<MyRecipe> {
    public static final MyRecipeSerializer INSTANCE = new MyRecipeSerializer();

    @Override
    public MyRecipe fromJson(ResourceLocation id, JsonObject json) {
        Ingredient input = Ingredient.fromJson(JsonOps.INSTANCE, json.get("input"));
        ItemStack output = CraftingHelper.getItemStack(JsonOps.INSTANCE, json.get("output"), true);
        int time = GsonHelper.getAsInt(json, "processingTime", 200);
        return new MyRecipe(id, input, output, time);
    }

    @Override
    public MyRecipe fromNetwork(ResourceLocation id, FriendlyByteBuf buf) {
        Ingredient input = Ingredient.STREAM_CODEC.fromNetwork(buf);
        ItemStack output = buf.readItem();
        int time = buf.readInt();
        return new MyRecipe(id, input, output, time);
    }

    @Override
    public void toNetwork(FriendlyByteBuf buf, MyRecipe recipe) {
        recipe.getIngredients().get(0).toNetwork(buf);
        buf.writeItem(recipe.getResultItem());
        buf.writeInt(recipe.processingTime);
    }
}
```

## 4. 配方 JSON 格式

```json
{
  "type": "mymod:my_recipe",
  "ingredient": { "item": "minecraft:diamond" },
  "result": { "item": "mymod:processed_diamond", "count": 2 },
  "processingTime": 400
}
```

## 常见错误

- ❌ `RecipeType` 写在 DeferredRegister 中 → 不支持，必须用 `RecipeType.register()`
- ❌ `RecipeSerializer` 忘了在 mod 初始化时调用 → 配方无法被加载
- ❌ `assemble` / `getResultItem` 返回原对象而非副本 → 多个配方实例共享同一 ItemStack

## 参考资料

- Forge 官方文档：https://docs.minecraftforge.net/en/1.18.2/

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-datagen` | DataGen 生成配方 JSON |
| `mc-networking` | 配方相关网络同步 |
| `mc-blockentity` | 机器方块内处理配方的 tick 逻辑 |
