---
name: mc-recipe
description: Minecraft Forge 自定义配方开发。RecipeType、RecipeSerializer、自定义配方实现。触发词：Recipe、RecipeType、RecipeSerializer、RecipeProvider、IRecipe、Ingredient
platform: forge
version: "1.14.4"
dependencies: []
mappings: mcp
---

# 自定义配方开发（Forge 1.14.4）

## 快速总览

```
注册 RecipeType（RegistryEvent） → 实现 Recipe 类 → 注册 RecipeSerializer（RegistryEvent） → 注册 Container（可选）
```

## 1. 注册 RecipeType

`RecipeType` 使用**静态注册**：

```java
public static final RecipeType<MyRecipe> MILLING =
    IRecipe.RECIPE_TYPE.register(new ResourceLocation(MOD_ID, "milling").toString(),
        new RecipeType<MyRecipe>() {
            @Override
            public String toString() {
                return MOD_ID + ":milling";
            }
        }
    );
```

## 2. 实现 Recipe 类

```java
public class MyRecipe implements IRecipe<Inventory> {
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
    public boolean matches(Inventory inv, World world) {
        return input.test(inv.getStackInSlot(0));
    }

    @Override
    public ItemStack getCraftingResult(Inventory inv) {
        return output.copy();
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
        return ModRecipeSerializers.MY_SERIALIZER;
    }

    @Override
    public IRecipeType<?> getType() {
        return ModRecipes.MILLING;
    }
}
```

> `getCraftingResult` 和 `getRecipeOutput` **必须返回副本**（`output.copy()`），否则同一个 ItemStack 实例被修改会影响原配方。

## 3. 注册 RecipeSerializer

`RecipeSerializer` 使用**静态注册**：

```java
public static final RecipeSerializer<MyRecipe> MY_SERIALIZER =
    new RecipeSerializer<MyRecipe>() {
        @Override
        public MyRecipe read(ResourceLocation id, JsonObject json) {
            Ingredient input = Ingredient.deserialize(json.get("input"));
            ItemStack output = CraftingHelper.getItemStack(
                json.getAsJsonObject("output"), true
            );
            int time = JsonUtils.getInt(json, "processingTime", 200);
            return new MyRecipe(id, input, output, time);
        }

        @Override
        public MyRecipe read(ResourceLocation id, PacketBuffer buf) {
            return new MyRecipe(id,
                Ingredient.read(buf),
                buf.readItemStack(),
                buf.readVarInt()
            );
        }

        @Override
        public void write(PacketBuffer buf, MyRecipe recipe) {
            recipe.getIngredients().get(0).write(buf);
            buf.writeItemStack(recipe.getRecipeOutput());
            buf.writeVarInt(recipe.processingTime);
        }
    };

@SubscribeEvent
public static void onRecipeSerializerRegistry(final RegistryEvent.Register<IRecipeSerializer> event) {
    event.getRegistry().register(
        MY_SERIALIZER.setRegistryName(new ResourceLocation(MOD_ID, "my_recipe"))
    );
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

- `"type"` 必须与 RecipeType 注册名一致
- `"input"` 可以是对象或数组

## 常见错误

- ❌ `getCraftingResult` / `getRecipeOutput` 返回原对象而非副本 → 多个配方实例共享同一 ItemStack
- ❌ `RecipeType` 写在 DeferredRegister 中 → 不支持，必须用 `IRecipe.RECIPE_TYPE.register()`
- ❌ `RecipeSerializer` 忘了在 mod 初始化时注册 → 配方无法被加载
- ❌ `Ingredient.deserialize()` 接收对象 → 必须是 `Ingredient` 实例或数组

## 参考资料

- 官方文档：https://docs.minecraftforge.net/en/1.14.4/

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-datagen` | 手动编写配方 JSON |
| `mc-networking` | 配方相关网络同步 |
| `mc-blockentity` | 机器方块内处理配方的 tick 逻辑 |
