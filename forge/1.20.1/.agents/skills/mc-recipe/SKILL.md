---
name: mc-recipe
description: Minecraft Forge 自定义配方开发。RecipeType、RecipeSerializer、自定义配方实现、Datagen。触发词：Recipe、RecipeType、RecipeSerializer、RecipeProvider、ProcessingRecipe、Ingredient
platform: forge
version: "1.20.1"
dependencies: []
mappings: mcp
---

# 自定义配方开发（Forge 1.20.1）

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

推荐使用 **record**（简洁、无 setter）：

```java
public record MyRecipe(
    ResourceLocation id,
    Ingredient input,
    ItemStack output,
    int processingTime
) implements Recipe<Container> {

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
    public RecipeType<?> getType() {
        return ModRecipes.MILLING;
    }

    @Override
    public RecipeSerializer<?> getSerializer() {
        return ModRecipeSerializers.MY_SERIALIZER.get();
    }

    @Override
    public boolean canCraftInDimensions(int w, int h) {
        return w * h >= 1;
    }
}
```

> `assemble` 和 `getResultItem` **必须返回副本**（`output.copy()`），否则同一个 ItemStack 实例被修改会影响原配方。

## 3. 注册 RecipeSerializer

`RecipeSerializer` 同样使用**静态注册**：

```java
// ModRecipeSerializers.java
public static final RegistryObject<RecipeSerializer<MyRecipe>> MY_SERIALIZER =
    RECIPE_SERIALIZERS.register("my_recipe",
        () -> MyRecipeSerializer.INSTANCE
    );

// MyRecipeSerializer.java
public class MyRecipeSerializer implements RecipeSerializer<MyRecipe> {
    public static final MyRecipeSerializer INSTANCE = new MyRecipeSerializer();

    @Override
    public MyRecipe fromJson(ResourceLocation id, JsonObject json) {
        Ingredient input = Ingredient.fromJson(JsonHelpers.getAsArray(json, "input"));
        ItemStack output = CraftingHelper.getItemStack(
            JsonHelpers.getAsObject(json, "output"), true
        );
        int time = JsonHelpers.getAsInt(json, "processingTime", 200);
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
        recipe.input().toNetwork(buf);
        buf.writeItem(recipe.output());
        buf.writeInt(recipe.processingTime());
    }
}
```

> `Ingredient.fromJson` 接收的 JSON 必须是**数组**：`[{ "item": "minecraft:diamond" }]`，不是 `{ "item": "..." }`。

## 4. 在 mod 初始化时调用注册

```java
public class MyMod {
    public MyMod() {
        // 静态注册（static 块或构造函数）
        ModRecipes.register();        // 注册 RecipeType
        ModRecipeSerializers.register(); // 注册 RecipeSerializer
    }
}
```

## 5. 配方 JSON 格式

```json
{
  "type": "mymod:my_recipe",
  "input": [{ "item": "minecraft:diamond" }],
  "output": { "item": "mymod:processed_diamond", "count": 2 },
  "processingTime": 400
}
```

- `"type"` 必须与 `RecipeSerializer` 注册名一致
- `"input"` 必须是数组

## 6. DataGen（自定义 Serializer）

> 注意：官方文档未覆盖自定义 Serializer 的 DataGen 流程，以下方案基于社区最佳实践。

```java
public class MyRecipeProvider extends RecipeProvider {
    public MyRecipeProvider(PackOutput output, CompletableFuture<HolderLookup.Provider> registries,
                            CompletableFuture<HolderLookup.Provider> builtins) {
        super(output, registries);
    }

    @Override
    protected void buildRecipes(Consumer<FinishedRecipe> consumer) {
        // 手动构造 FinishedRecipe
        ShapedRecipePattern pattern = ShapedRecipePattern.of(
            Ingredient.of(Items.DIAMOND), 1,
            "", "",
            "", ""
        );
        ShapedRecipeBuilder.shaped(result, pattern)
            .unlockedBy("has_diamond", has(Items.DIAMOND))
            .save(consumer, MOD_ID + ":my_recipe");
    }
}
```

对于自定义 Serializer，需要手动实现 `FinishedRecipe`：

```java
public class MyFinishedRecipe implements FinishedRecipe {
    private final ResourceLocation id;
    private final Ingredient input;
    private final ItemStack output;
    private final int time;

    public MyFinishedRecipe(ResourceLocation id, Ingredient input, ItemStack output, int time) {
        this.id = id;
        this.input = input;
        this.output = output;
        this.time = time;
    }

    @Override
    public void serializeRecipeData(JsonObject json) {
        json.add("input", input.toJson());
        json.addProperty("output", BuiltInRegistries.ITEM.getKey(output.getItem()).toString());
        json.addProperty("count", output.getCount());
        json.addProperty("processingTime", time);
    }

    @Override
    public ResourceLocation id() { return id; }

    @Override
    public RecipeSerializer<?> type() { return MyRecipeSerializer.INSTANCE; }

    @Override
    public JsonObject advancement() { return null; }

    @Override
    public void serializeAdvancement(JsonObject advancement) {}
}
```

## Decision: 选择配方方式

```
IF 配方逻辑简单（物品 → 物品）
  → 继承 SimpleRecipe + 注册 Serializer

IF 处理机配方（有时间参数）
  → 创建 record MyRecipe implements Recipe<Container>

IF 配方数量多、固定格式
  → DataGen 生成 JSON（RecipeProvider）
```

## 常见错误

- ❌ `Ingredient.fromJson` 参数不是数组 → `{ "item": "..." }` 改为 `[{ "item": "..." }]`
- ❌ `assemble` / `getResultItem` 返回原对象而非副本 → 多个配方实例共享同一 ItemStack
- ❌ `RecipeType` 写在 DeferredRegister 中 → 不支持，必须用 `RecipeType.register()`
- ❌ `RecipeSerializer` 忘了在 mod 初始化时调用 → 配方无法被加载
- ❌ `RecipeProvider` 中硬编码数据 → 使用 `FinishedRecipe` 接口自定义序列化

## 参考资料

- 官方文档：https://docs.minecraftforge.net/en/1.20.1/resources/server/recipes/
- 非数据包配方：https://docs.minecraftforge.net/en/1.20.1/resources/server/recipes/incode/
- DataGen：https://docs.minecraftforge.net/en/1.20.1/datagen/server/recipes/

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-datagen` | DataGen 生成配方 JSON |
| `mc-networking` | 配方相关网络同步 |
| `mc-blockentity` | 机器方块内处理配方的 tick 逻辑 |
