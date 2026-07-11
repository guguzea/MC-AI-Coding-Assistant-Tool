# Fabric 配方系统命令参考

本文件描述 Fabric 1.20.1 平台上进行配方（Recipe）系统开发时所需掌握的核心 API 和常用命令。

## 配方概述

Minecraft 的配方系统定义了物品之间的转换规则，包括合成配方、冶炼配方、锻造配方、酿造配方等。Fabric 中配方可以在运行时注册，也可以通过数据生成器（DataGen）静态生成。对于模组开发，推荐使用数据生成器生成配方，这样可以自动处理配方 ID、合并模组数据包。

## 数据生成器配方命令

### 依赖配置命令

在 `build.gradle` 中添加数据生成 API 依赖：

```groovy
dependencies {
    modApi "net.fabricmc.fabric-api:fabric-datagen-api-v0:4.2.1+1.21"
}
```

### RecipeGenerator 创建命令

创建配方生成器实现 `FabricDataGenerator.PackFactory`：

```java
public class MyRecipeProvider implements FabricDataGenerator.PackFactory {
    @Override
    public void generateFabricData(GeneratorContext context) {
        PackOutput output = context.getPackOutput();
        RecipeGenerator generator = RecipeGenerator.of(output);
        
        // 添加配方
        generator.createShapedRecipe(...)
            .criterion("has_item", ...)
            .offerTo(generator);
            
        generator.createShapelessRecipe(...)
            .criterion("has_item", ...)
            .offerTo(generator);
            
        generator.generate();
    }
}
```

## 有形配方命令

### ShapedRecipeJsonBuilder 有形配方命令

有形配方（Shaped）要求材料按特定形状排列：

```java
ShapedRecipeJsonBuilder.create(
    RecipeCategory.BUILDING_AND_BLOCKS,  // 配方分类（影响创意栏分组）
    ExampleModBlocks.MY_BLOCK.get(),
    1  // 数量
)
.pattern("ABA")  // 第一行
.pattern("B B")  // 第二行
.pattern("ABA")  // 第三行
.input('A', Items.DIAMOND)           // 'A' = 钻石
.input('B', Items.IRON_INGOT)        // 'B' = 铁锭
.criterion("has_diamond", 
    RecipeProvider.conditionsFromItem(Items.DIAMOND))  // 解锁条件
.offerTo(exporter);  // 输出到配方文件
```

### 形状规则命令

有形配方规则：
- 最多 3 行，每行最多 3 个字符
- 相同字符表示相同材料
- 空格或 `.` 表示空位
- 配方会自动镜像（如左右对称的配方不需要额外定义）

### 配方分类命令

`RecipeCategory` 决定配方在创意栏中的分组位置：

```java
RecipeCategory.BUILDING_AND_BLOCKS  // 建筑方块
RecipeCategory.DECORATIONS          // 装饰物品
RecipeCategory.MISC                 // 杂项
RecipeCategory.EQUIPMENT            // 工具和盔甲
RecipeCategory.MATERIALS            // 原材料
RecipeCategory.FOOD                 // 食物
```

## 无形配方命令

### ShapelessRecipeJsonBuilder 无形配方命令

无形配方（Shapeless）不要求材料排列位置：

```java
ShapelessRecipeJsonBuilder.create(
    RecipeCategory.MISC,
    ExampleModItems.MY_ITEM.get(),
    2  // 输出数量
)
.input(Items.DIAMOND)        // 材料1
.input(Items.GOLD_INGOT)    // 材料2
.input(Items.STICK)         // 材料3
.criterion("has_gold",
    RecipeProvider.conditionsFromItem(Items.GOLD_INGOT))
.offerTo(exporter);
```

无形配方最多支持 9 种不同材料。

## 冶炼配方命令

### SmokingRecipeJsonBuilder 烟熏配方命令

烟熏炉配方：

```java
SmokingRecipeJsonBuilder.create(
    RecipeCategory.FOOD,
    new ItemStack(Items.COOKED_BEEF),
    Items.BEEF,
    2.0f,  // 经验值
    100    // 烹饪时间（tick）
)
.criterion("has_beef", RecipeProvider.conditionsFromItem(Items.BEEF))
.offerTo(exporter);
```

### BlastingRecipeJsonBuilder 高炉配方命令

高炉配方（比烟熏炉快）：

```java
BlastingRecipeJsonBuilder.create(
    RecipeCategory.MISC,
    ExampleModItems.COPPER_INGOT.get(),
    Items.RAW_COPPER,
    1.0f,
    100
)
.criterion("has_raw_copper", RecipeProvider.conditionsFromItem(Items.RAW_COPPER))
.offerTo(exporter);
```

### CampfireRecipeJsonBuilder 营火配方命令

营火配方（比烟熏炉慢但可以烤多个）：

```java
CampfireRecipeJsonBuilder.create(
    RecipeCategory.FOOD,
    new ItemStack(Items.COOKED_COD),
    Items.COD,
    0.35f,
    600
)
.criterion("has_cod", RecipeProvider.conditionsFromItem(Items.COD))
.offerTo(exporter);
```

### SmeltingRecipeJsonBuilder 熔炉配方命令

普通熔炉配方：

```java
SmeltingRecipeJsonBuilder.create(
    RecipeCategory.MISC,
    ExampleModItems.COPPER_NUGGET.get(),
    Items.RAW_COPPER,
    0.1f,
    200
)
.criterion("has_raw_copper", RecipeProvider.conditionsFromItem(Items.RAW_COPPER))
.offerTo(exporter);
```

## 锻造配方命令

### SmithingRecipeJsonBuilder 锻造配方命令

下界合金升级（1.20+）：

```java
SmithingRecipeJsonBuilder.create(
    TemplateIngredient.of(Items.NETHERITE_UPGRADE_SMITHING_TEMPLATE),  // 模板
    Ingredient.ofItems(Items.DIAMOND_PICKAXE),                         // 基础物品
    Ingredient.ofItems(Items.NETHERITE_INGOT),                         // 添加材料
    RecipeCategory.EQUIPMENT,
    ExampleModItems.NETHERITE_PICKAXE.get()
)
.criterion("has_netherite_ingot", 
    RecipeProvider.conditionsFromItem(Items.NETHERITE_INGOT))
.offerTo(exporter);
```

### SmithingTransformRecipe 旧版锻造命令

1.16-1.19 版本的装备锻造配方使用类似结构但不同 API。

## 切割配方命令

### StonecuttingRecipeJsonBuilder 切割配方命令

切石机配方：

```java
StonecuttingRecipeJsonBuilder.create(
    RecipeCategory.BUILDING_AND_BLOCKS,
    ExampleModBlocks.MY_SLAB.get(),
    Items.COBBLESTONE,
    2  // 数量
)
.criterion("has_cobblestone", 
    RecipeProvider.conditionsFromItem(Items.COBBLESTONE))
.offerTo(exporter);
```

## 配方条件命令

### Criterion 解锁条件命令

每个配方需要定义解锁条件（criterion）：

```java
.criterion(String name, RecipeProviderConditions conditions)

// 常用条件
RecipeProvider.conditionsFromItem(ItemConvertible item)           // 持有物品
RecipeProvider.conditionsFromTag(TagKey<Item> tag)                // 持有标签内物品
RecipeProvider.conditionsFromEffect(StatusEffectInstance effect)   // 有状态效果
RecipeProvider.conditionsFromPlayerHasItem(ItemConvertible item)   // 玩家持有物品
```

### hasItem 条件工厂命令

```java
.hasItem(Items.DIAMOND)
```

等价于：

```java
.criterion("has_diamond", RecipeProvider.conditionsFromItem(Items.DIAMOND))
```

## 配方 ID 和输出路径命令

### offerTo() 输出命令

`offerTo()` 方法决定配方的输出文件路径：

```java
.offerTo(Exporter)
.offerTo(Exporter, new Identifier(MOD_ID, "custom_recipe_name"))
```

默认情况下，配方 ID 自动生成（如 `examplemod:my_item` 对应文件 `data/examplemod/recipes/my_item.json`）。传入自定义 `Identifier` 可以指定不同名称。

## 物品转换器命令

### ItemConvertible 接口命令

配方中使用 `ItemConvertible` 接口接受物品或方块作为输入：

```java
.input('A', Items.DIAMOND)         // 直接使用 Item
.input('B', Blocks.IRON_BLOCK)    // 使用 Block（自动转为 Item）
.input('C', ItemTags.createRaw("c"))  // 使用标签
```

### Ingredient.ofItems() 命令

对于复杂配方，使用 `Ingredient`：

```java
Ingredient.ofItems(Items.DIAMOND, Items.EMERALD)  // 任意一个
Ingredient.ofStacks(ItemStack)                    // 特定 NBT
Ingredient.fromTag(TagKey<Item>)                  // 标签内任意物品
```

## 配方表命令

### 配方表生成命令

配方表（Recipe Unlock Table）用于在进度中显示可用配方：

```java
// 在进度生成器中
 Advancement.Builder.create()
    .parent(...)
    .display(...)
    .rewards(AdvancementRewards.Builder.recipe(
        RecipeId.getItemId(ExampleModItems.MY_ITEM.get())))
```

## 运行时配方注册命令

### RecipeManager.addRecipe() 命令

虽然推荐使用数据生成，但也可以在运行时注册配方：

```java
ServerLifecycleEvents.SERVER_STARTED.register(server -> {
    RecipeManager manager = server.getRecipeManager();
    manager.addRecipe(new ShapedRecipe(
        ...  // 配方参数
    ));
});
```

运行时注册的配方不会保存到数据包中，服务器重启后会丢失。

## 自定义配方类型命令

### Fabric 扩展命令

Fabric 提供了 `fabric-recipes-api-v1` 模块用于自定义配方类型：

```groovy
modImplementation "net.fabricmc.fabric-api:fabric-recipes-api-v1:1.0.0+1.21"
```

可以创建完全自定义的配方类型和处理逻辑，适用于特殊的合成系统（如符文合成、符文石板等）。
