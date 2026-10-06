---
name: mc-recipe
description: Minecraft Forge 自定义配方开发。RecipeType、RecipeSerializer、自定义配方实现、Datagen。触发词：Recipe、RecipeType、RecipeSerializer、RecipeProvider、ProcessingRecipe、Ingredient
platform: forge
version: "1.20.4"
dependencies: []
mappings: parchment
---

# 自定义配方开发（Forge 1.20.4）

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
    // javap 实证 2026-10-05：本档 Recipe 接口没有 getId()（1.20.5+ 才有），record 不要放 id —— id 由 RecipeOutput.accept 单独传入
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

    // javap 实证 2026-10-05：1.20.4 的 RecipeSerializer 接口 = codec() + fromNetwork(FriendlyByteBuf) + toNetwork(FriendlyByteBuf, T)。
    // fromJson(ResourceLocation, JsonObject) 已从接口删除（那是 1.20.1 及更早的三件套）；JSON 读写走 Codec，
    // Ingredient 的 CODEC / CODEC_NONEMPTY 与 ItemStack.SINGLE_ITEM_CODEC 都是本档构件里的真实字段。
    public static final Codec<MyRecipe> CODEC = RecordCodecBuilder.create(i -> i.group(
        Ingredient.CODEC_NONEMPTY.fieldOf("input").forGetter(MyRecipe::input),
        ItemStack.SINGLE_ITEM_CODEC.fieldOf("output").forGetter(MyRecipe::output),
        Codec.INT.optionalFieldOf("processingTime", 200).forGetter(MyRecipe::processingTime)
    ).apply(i, MyRecipe::new));

    @Override
    public Codec<MyRecipe> codec() {
        return CODEC;
    }

    @Override
    public MyRecipe fromNetwork(FriendlyByteBuf buf) {
        Ingredient input = Ingredient.fromNetwork(buf);   // javap 实证：本档 Ingredient 无 fromJson/STREAM_CODEC，网络工厂 = fromNetwork(FriendlyByteBuf)
        ItemStack output = buf.readItem();
        int time = buf.readInt();
        return new MyRecipe(input, output, time);
    }

    @Override
    public void toNetwork(FriendlyByteBuf buf, MyRecipe recipe) {
        recipe.input().toNetwork(buf);
        buf.writeItem(recipe.output());
        buf.writeInt(recipe.processingTime());
    }
}
```

> 本档 Ingredient 没有 `fromJson`（javap 实证）——JSON 字段由 `Ingredient.CODEC` 解析，单个对象 `{ "item": ... }` 与数组 `[{ "item": ... }]` 都接受。

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
- `"input"` 由 `Ingredient.CODEC` 解析，对象与数组两种写法都接受（见上注；旧版「必须是数组」是 ≤1.20.1 的 `fromJson` 行为）

## 6. DataGen（自定义 Serializer）

> javap 实证 2026-10-05（`forge-1.20.4-49.2.0` 构件）：本档 `RecipeProvider` 构造**只带 `PackOutput`**；`buildRecipes` 收 **`RecipeOutput`**；
> `net.minecraft.data.recipes.FinishedRecipe` 接口在本档构件已**不存在**（`javap` 类未找到）——不要再手写 FinishedRecipe 类。
> 自定义配方的 DataGen = 直接构造 Recipe 实例交给 `RecipeOutput.accept(id, recipe, advancementHolder)`，
> JSON 由 `RecipeSerializer.codec()` 序列化生成（RecipeOutput 内部调用）。

```java
public class MyRecipeProvider extends RecipeProvider {
    public MyRecipeProvider(PackOutput output) {
        super(output);   // 1.20.4 单参构造（1.20.1 的 (output, registries) 双参形态在本档构件 javap 不存在）
    }

    @Override
    protected void buildRecipes(RecipeOutput output) {   // 不再收 Consumer<FinishedRecipe>
        // 1) 自定义配方：直接 new 出 Recipe，交给 accept（第三参 AdvancementHolder 可为 null）
        MyRecipe recipe = new MyRecipe(
            Ingredient.of(Items.DIAMOND),
            new ItemStack(ModItems.PROCESSED_DIAMOND, 2),
            400
        );
        output.accept(new ResourceLocation(MOD_ID, "my_recipe"), recipe, null);

        // 2) 合成表配方用 builder（204 形参 = RecipeCategory + ItemLike，见 javap）
        ShapedRecipeBuilder.shaped(RecipeCategory.MISC, ModItems.PROCESSED_DIAMOND, 2)
            .pattern("XXX")
            .define('X', Items.DIAMOND)
            .unlockedBy("has_diamond", has(Items.DIAMOND))
            .save(output, new ResourceLocation(MOD_ID, "my_recipe2"));
    }
}
```

> `ShapedRecipePattern.of(Ingredient, int, String...)` 与 `ShapedRecipeBuilder.shaped(ItemStack, pattern)` 在本档构件 javap **无此重载**（`of` 只有 `(Map, String...)` / `(Map, List)`；`shaped` 只有 `(RecipeCategory, ItemLike[, int])`），照旧写法编译必失败。

## Decision: 选择配方方式

```
IF 配方逻辑简单（物品 → 物品）
  → 实现 Recipe<C> 类 + 注册 Serializer（构件 javap 实证本档无 SimpleRecipe 类，勿继承该名）

IF 处理机配方（有时间参数）
  → 创建 record MyRecipe implements Recipe<Container>

IF 配方数量多、固定格式
  → DataGen 生成 JSON（RecipeProvider）
```

## 常见错误

- ❌ 仍按 1.20.1 写 `fromJson(ResourceLocation, JsonObject)` / `Ingredient.fromJson` / `Ingredient.STREAM_CODEC` / `FinishedRecipe` 实现类 → 本档接口已 codec 化，这些方法/接口在 1.20.4 构件里都不存在（javap 实证 2026-10-05），改用 `codec()` + `RecipeOutput.accept`
- ❌ `assemble` / `getResultItem` 返回原对象而非副本 → 多个配方实例共享同一 ItemStack
- ❌ `RecipeType` 写在 DeferredRegister 中 → 不支持，必须用 `RecipeType.register()`
- ❌ `RecipeSerializer` 忘了在 mod 初始化时调用 → 配方无法被加载
- ❌ `RecipeProvider` 中硬编码数据 → 用 DataGen 构造 Recipe 实例后交给 `RecipeOutput.accept`（本档已无 `FinishedRecipe` 接口可写）

## 参考资料

- 官方文档：https://docs.minecraftforge.net/en/1.20.4/resources/server/recipes/
- 非数据包配方：https://docs.minecraftforge.net/en/1.20.4/resources/server/recipes/incode/
- DataGen：https://docs.minecraftforge.net/en/1.20.4/datagen/server/recipes/

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-datagen` | DataGen 生成配方 JSON |
| `mc-networking` | 配方相关网络同步 |
| `mc-blockentity` | 机器方块内处理配方的 tick 逻辑 |
