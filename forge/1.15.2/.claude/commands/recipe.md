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
注册 RecipeType（静态） → 实现 Recipe 类 → 注册 RecipeSerializer（静态） → DataGen（可选）
```

## 1. 注册 RecipeType

`RecipeType` 不支持 `DeferredRegister`，使用**静态注册**：

```java
public static final RecipeType<MyRecipe> MILLING = RecipeType.register(MOD_ID + ":milling");
```

## 2. 实现 Recipe 类

```java
public class MyRecipe implements IRecipe<ICraftingGrid> {

    @Override
    public boolean matches(ICraftingGrid inv, World world) {
        return input.test(inv.getStackInSlot(0));
    }

    @Override
    public ItemStack getCraftingResult(ICraftingGrid inv) {
        return output.copy();  // 必须返回副本
    }

    @Override
    public boolean canFit(int width, int height) {
        return width * height >= 1;
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

## 3. 注册 RecipeSerializer

`RecipeSerializer` 同样使用**静态注册**：

```java
public class MyRecipeSerializer extends RecipeSerializer<MyRecipe> {
    public static final MyRecipeSerializer INSTANCE = new MyRecipeSerializer();

    @Override
    public MyRecipe read(ResourceLocation id, JsonObject json) {
        // 读取 JSON
    }

    @Override
    public MyRecipe read(ResourceLocation id, PacketBuffer buf) {
        // 读取网络包
    }

    @Override
    public void write(PacketBuffer buf, MyRecipe recipe) {
        // 写入网络包
    }
}

// 静态注册
public static final RegistryObject<RecipeSerializer<MyRecipe>> MY_SERIALIZER =
    RECIPE_SERIALIZERS.register("my_recipe", () -> MyRecipeSerializer.INSTANCE);
```

## 4. 在 mod 初始化时调用注册

```java
public class MyMod {
    public MyMod() {
        // 静态注册
        ModRecipes.register();        // 注册 RecipeType
        ModRecipeSerializers.register(); // 注册 RecipeSerializer
    }
}
```

## 5. 配方 JSON 格式

```json
{
  "type": "mymod:my_recipe",
  "ingredient": { "item": "minecraft:diamond" },
  "result": { "item": "mymod:processed_diamond", "count": 2 }
}
```

- `"type"` 必须与 `RecipeSerializer` 注册名一致

## Decision: 选择配方方式

```
IF 配方逻辑简单（物品 → 物品）
  → 继承 IRecipe + 注册 Serializer

IF 用自定义工作台配方
  → 需要实现 IRecipe 或扩展现有配方
  → 需要自定义 Container 和 Screen
```

## 常见错误

- ❌ `RecipeType` 写在 DeferredRegister 中 → 不支持，必须用 `RecipeType.register()`
- ❌ `RecipeSerializer` 忘了在 mod 初始化时调用 → 配方无法被加载
- ❌ `getCraftingResult` 返回原对象而非副本 → 多个配方实例共享同一 ItemStack

## 参考资料

- 官方文档：https://docs.minecraftforge.net/en/1.15.2/

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-datagen` | DataGen 生成配方 JSON |
| `mc-blockentity` | 机器方块内处理配方的 tick 逻辑 |
