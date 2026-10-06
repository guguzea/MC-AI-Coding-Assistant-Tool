---
name: mc-recipe
description: Minecraft Forge 自定义配方开发。RecipeType、RecipeSerializer、自定义配方实现、Datagen。触发词：Recipe、RecipeType、RecipeSerializer、RecipeProvider、ProcessingRecipe、Ingredient
platform: forge
version: "1.14.4"
dependencies: []
mappings: mcp
---

# 自定义配方开发（Forge 1.14.4）

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
    private final ResourceLocation id;
    private final Ingredient input;
    private final ItemStack output;
    private final int processingTime;

    public MyRecipe(ResourceLocation id, Ingredient input, ItemStack output, int time) {
        this.id = id;
        this.input = input;
        this.output = output;
        this.processingTime = time;
    }

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
    public ResourceLocation getId() {
        return id;
    }

    @Override
    public IRecipeSerializer<?> getSerializer() {
        return ModRecipeSerializers.MY_SERIALIZER.get();
    }

    @Override
    public IRecipeType<?> getType() {
        return MILLING;
    }
}
```

## 3. 注册 RecipeSerializer

```java
public static final RegistryObject<IRecipeSerializer<MyRecipe>> MY_SERIALIZER =   // javap 实证：本档接口名 = IRecipeSerializer（RecipeSerializer 是 1.17+ 名）
    RECIPE_SERIALIZERS.register("my_recipe", () -> MyRecipeSerializer.INSTANCE);

public class MyRecipeSerializer implements IRecipeSerializer<MyRecipe> {
    public static final MyRecipeSerializer INSTANCE = new MyRecipeSerializer();

    @Override
    public MyRecipe read(ResourceLocation id, JsonObject json) {
        Ingredient input = Ingredient.deserialize(json.getAsJsonArray("input"));
        // javap 实证 2026-10-05：144 的 Ingredient 没有 fromJson（那是 1.16+ 名），json 工厂 = deserialize(JsonElement)
        ItemStack output = ShapedRecipe.deserializeItem(JSONUtils.getJsonObject(json, "output"));
        // javap 实证：类名 = JSONUtils（全大写 JSON），本档有 getJsonObject(JsonObject,String)/getInt(JsonObject,String,int)
        int time = JSONUtils.getInt(json, "processingTime", 200);
        return new MyRecipe(id, input, output, time);
    }

    @Override
    public MyRecipe read(ResourceLocation id, PacketBuffer buf) {
        Ingredient input = Ingredient.read(buf);
        ItemStack output = buf.readItemStack();
        int time = buf.readInt();
        return new MyRecipe(id, input, output, time);
    }

    @Override
    public void write(PacketBuffer buf, MyRecipe recipe) {
        recipe.input.write(buf);
        buf.writeItemStack(recipe.output);
        buf.writeInt(recipe.processingTime);
    }
}
```

## 4. DataGen（RecipeProvider）

```java
public class MyRecipeProvider extends RecipeProvider {
    public MyRecipeProvider(DataGenerator generator) {
        super(generator);
    }

    @Override
    protected void registerRecipes(Consumer<IFinishedRecipe> consumer) {
        // 构件实证 2026-10-05：144 jar 只有接口 `IFinishedRecipe`（没有具体类 `FinishedRecipe`），
        // 抽象方法 = serialize(JsonObject) / getID() / getSerializer() / getAdvancementJson() / getAdvancementID()
        // （getRecipeJson() 是 default）。⇒ 自定义配方匿名实现接口：
        consumer.accept(new IFinishedRecipe() {
            @Override
            public void serialize(JsonObject json) {
                json.addProperty("type", MOD_ID + ":milling");
                json.add("input", Ingredient.fromItems(Items.DIAMOND).serialize());
                JsonObject result = new JsonObject();
                result.addProperty("item", ModItems.PROCESSED_DIAMOND.get().getRegistryName().toString());
                result.addProperty("count", 2);
                json.add("output", result);
                json.addProperty("processingTime", 400);
            }
            @Override
            public ResourceLocation getID() {
                return new ResourceLocation(MOD_ID, "my_recipe");
            }
            @Override
            public IRecipeSerializer<?> getSerializer() {
                return ModRecipeSerializers.MY_SERIALIZER.get();
            }
            @Override
            public JsonObject getAdvancementJson() {
                return null; // 不需要伴随进度
            }
            @Override
            public ResourceLocation getAdvancementID() {
                return null;
            }
        });
    }
}

// GatherDataEvent 中：
generator.addProvider(new MyRecipeProvider(generator));
```

## Decision: 选择配方方式

```
IF 配方逻辑简单（物品 → 物品）
  → 实现 IRecipe + IRecipeSerializer

IF 处理机配方（有时间参数）
  → 自定义 IRecipe 类 + IRecipeType.register

IF 配方数量多、固定格式
  → DataGen 生成 JSON（RecipeProvider）
```

## 常见错误

- ❌ `record` / `PackOutput` / `RegistryAccess` / `assemble()` — 1.19+ API
- ❌ `RecipeType.register` 写在 DeferredRegister 中 — 用 `IRecipeType.register(String)`
- ❌ `getCraftingResult` 返回原对象而非副本

## 参考资料

- Forge 官方文档：https://docs.minecraftforge.net/en/1.14.4/resources/server/recipes/

## 扩展点

| 配合 Skill | 协作说明 |
|-------------|-----------|
| `mc-datagen` | DataGen 生成配方 JSON |
| `mc-blockentity` | 机器方块内处理配方的 tick 逻辑 |
