---
name: mc-recipe
description: Minecraft Forge 自定义配方开发。RecipeType、RecipeSerializer，自定义配方实现。触发词：Recipe、RecipeType、RecipeSerializer、RecipeProvider、IIngredient
platform: forge
version: "1.16.5"
dependencies: []
mappings: official
---

# 自定义配方开发（Forge 1.16.5）

## 快速总览

```
注册 IRecipeType（静态） → 实现 IRecipe 类 → 注册 IRecipeSerializer（静态） → DataGen（可选）
```

> javap 实证 2026-10-05（真构件 `forge-1.16.5-36.2.34_mapped_official_1.16.5`）：本档类名带 `I` 前缀 = `IRecipe` / `IRecipeType` / `IRecipeSerializer`；`RecipeType` / `RecipeSerializer` / `CraftingContainer` 都是 **1.17.1+ 名**，本档构件没有。合成容器类名 = `CraftingInventory`。

## 1. 注册 IRecipeType

`IRecipeType` 不支持 `DeferredRegister`，使用**静态注册**：

```java
public static final IRecipeType<MyRecipe> MILLING =
    IRecipeType.register(MOD_ID + ":milling");   // javap 实证：本档为 IRecipeType.register(String)
```

## 2. 实现 IRecipe 类

```java
public class MyRecipe implements IRecipe<CraftingInventory> {

    private final Ingredient input;
    private final ItemStack output;
    private final int processingTime;

    public MyRecipe(ResourceLocation id, Ingredient input, ItemStack output, int processingTime) {
        this.input = input;
        this.output = output;
        this.processingTime = processingTime;
    }

    @Override
    public boolean matches(CraftingInventory inv, World world) {
        return input.test(inv.getStack(0));
    }

    @Override
    public ItemStack assemble(CraftingInventory inv) {
        return output.copy();   // javap 实证：165 接口方法名 = assemble（getCraftingResult 是 ≤1.14.4 旧名）
    }

    @Override
    public boolean canCraftInDimensions(int width, int height) {
        return width * height >= 1;   // javap 实证：canFit 是 ≤1.14.4 旧名
    }

    @Override
    public ItemStack getResultItem() {
        return output.copy();
    }

    @Override
    public IRecipeSerializer<?> getSerializer() {
        return MyRecipeSerializer.INSTANCE;
    }

    @Override
    public IRecipeType<?> getType() {
        return MILLING;   // javap 实证：165 的 IRecipe 仍含抽象 getType()/getId()，实现类必须补
    }
}
```

> `assemble` / `getResultItem` **必须返回副本**（`output.copy()`），否则同一个 ItemStack 实例被修改会影响原配方。

## 3. 注册 IRecipeSerializer

`IRecipeSerializer` 使用**静态注册**，本档三个抽象方法 = `fromJson` / `fromNetwork` / `toNetwork`（javap 实证；`read`/`write` 是 ≤1.14.4 旧名）：

```java
// ModRecipeSerializers.java
public static final RegistryObject<IRecipeSerializer<MyRecipe>> MY_SERIALIZER =
    RECIPE_SERIALIZERS.register("my_recipe",
        () -> MyRecipeSerializer.INSTANCE
    );

// MyRecipeSerializer.java
public class MyRecipeSerializer implements IRecipeSerializer<MyRecipe> {
    public static final MyRecipeSerializer INSTANCE = new MyRecipeSerializer();

    @Override
    public MyRecipe fromJson(ResourceLocation id, JsonObject json) {
        Ingredient input = Ingredient.fromJson(json.get("input"));
        ItemStack output = ShapedRecipe.itemFromJson(json.getAsJsonObject("output"));   // javap 实证：本档静态工厂 = itemFromJson
        int time = JSONUtils.getAsInt(json, "processingTime", 200);   // javap 实证：165 的 JSONUtils 方法名已带 As 前缀（getInt 是 144 名）
        return new MyRecipe(id, input, output, time);
    }

    @Override
    public MyRecipe fromNetwork(ResourceLocation id, PacketBuffer buf) {
        Ingredient input = Ingredient.fromNetwork(buf);   // javap 实证：165 Ingredient 网络工厂 = fromNetwork（read 是 144 名）
        ItemStack output = buf.readItem();
        int time = buf.readVarInt();
        return new MyRecipe(id, input, output, time);
    }

    @Override
    public void toNetwork(PacketBuffer buf, MyRecipe recipe) {
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
- ❌ `getCraftingResult` / `canFit` / `read`/`write`（≤1.14.4 旧名）→ 本档接口是 `assemble` / `canCraftInDimensions` / `fromJson`·`fromNetwork`·`toNetwork`
- ❌ `IRecipeType` 写在 DeferredRegister 中 → 不支持，必须用 `IRecipeType.register()`
- ❌ `IRecipeSerializer` 忘了在 mod 初始化时调用 → 配方无法被加载
- ❌ 按 1.17+ 写法用 `RecipeType`/`RecipeSerializer`/`CraftingContainer` → 本档构件没有这些类名（javap 实证 2026-10-05）

## 参考资料

- 官方文档：https://docs.minecraftforge.net/en/1.16.5/

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-datagen` | DataGen 生成配方 JSON |
| `mc-networking` | 配方相关网络同步 |
| `mc-blockentity` | 机器方块内处理配方的 tick 逻辑 |
