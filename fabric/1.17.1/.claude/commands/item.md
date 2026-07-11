# Fabric 物品开发命令参考

本文件描述 Fabric 1.17.1 平台上进行物品（Item）开发时所需掌握的核心 API 和常用命令。

## 核心注册命令

### Registry.register()

Fabric 中所有物品都必须通过 `Registry.register()` 方法注册到游戏注册表中。与 Forge 不同，Fabric 没有 modEventBus，直接在 `onInitialize()` 方法中调用注册方法即可完成注册。物品注册的基本格式为：`Registry.register(Registry.ITEM, new Identifier(MOD_ID, "item_name"), itemInstance)`。其中第一个参数指定注册表类型为 `ITEM`，第二个参数使用 `Identifier` 构造唯一标识符，第三个参数是物品实例。注册时机必须在 mod 初始化阶段完成，否则物品不会出现在游戏中。物品默认耐久度是无限的（`Integer.MAX_VALUE`），需要手动设置 `.maxDamage()` 才会消耗耐久。

### Identifier 构造规范

创建 `Identifier` 时必须遵循严格的命名规范：mod ID 必须全小写且与 `fabric.mod.json` 中声明的完全一致，注册名称必须使用小写字母和下划线。正确的示例：`new Identifier("examplemod", "my_awesome_item")`。命名不一致会导致资源定位失败，游戏中物品显示为缺失的紫色物品或显示错误的名称。

### Item.Settings 配置命令

`Item.Settings` 是物品属性的配置器，控制物品的最大堆叠数量、耐久度、附魔属性、物品组归属等。基本创建命令为 `new Item.Settings()`，然后通过链式调用配置。常用配置包括：`.maxCount(int)` 设置最大堆叠数（默认 64），`.maxDamage(int)` 设置最大耐久度（设置后物品会消耗耐久），`.maxDamageIfAbsent(int)` 设置默认耐久度（无耐久物品时不生效），`.group(ItemGroup)` 设置物品所属的创造模式物品栏分类，`.recipeRemainder(Item)` 设置合成后剩余物品，`.fireproof()` 使物品防火（岩浆桶中的物品等）。

### 基础物品创建命令

创建没有特殊行为的普通物品只需要一行代码：`new Item(new Item.Settings())`。这只创建一个无限耐久、可堆叠 64 个的基础物品。更复杂的物品需要继承 `Item` 类并重写相关方法。继承时需要将 Settings 传递给父构造函数：`public class MyItem extends Item { public MyItem(Settings settings) { super(settings); } }`。

### FoodComponent 食物命令

创建可食用物品需要使用 `FoodComponent.Builder` 构建食物属性。基本命令格式：`.food(new FoodComponent.Builder().hunger(int).saturationModifier(float).build())`。`hunger()` 设置恢复的饱食点数（每个点数等于半格饥饿值），`saturationModifier()` 设置饱食度恢复系数。高级配置包括：`.statusEffect(new StatusEffectInstance(effect, duration, amplifier), probability)` 添加食用后的状态效果和生效概率，`.alwaysEdible()` 使食物即使饱腹时也可食用，`.snack()` 将食物标记为零食（可用于快速食用场景），`.meat()` 将食物标记为肉类（可用于喂食狼等）。

### ToolMaterial 工具材质命令

创建自定义工具需要定义 `ToolMaterial`（枚举实现 `ToolMaterial` 接口）。关键方法包括：`getDurability()` 返回耐久度，`getMiningSpeed()` 返回挖掘速度，`getAttackDamage()` 返回攻击伤害加成，`getMiningLevel()` 返回挖掘等级（0=木质，1=石质，2=铁质，3=钻石质，4=下界合金质），`getEnchantability()` 返回附魔等级，`getRepairIngredient()` 返回修复材料。Fabric 提供了预设的 `FabricToolTags` 用于指定工具可挖掘的方块类型。

### DiggerItem 挖掘工具命令

创建镐、斧、铲等挖掘工具使用 `DiggerItem` 或继承 `MiningToolItem`。基本命令：`new DiggerItem(float attackDamage, float attackSpeed, ToolMaterial material, TagKey<Block> blocks, Settings settings)`。其中 `attackSpeed` 参数常用值：镐 `-2.8f`，斧 `-3.2f`，铲 `1.0f`。`blocks` 参数使用 `FabricToolTags.PICKAXES` 等预设标签指定可挖掘的方块类型。

### 自定义物品行为命令

继承 `Item` 后可以重写多个方法定义行为。`use(World, PlayerEntity, Hand)` 定义右键使用逻辑，返回 `TypedActionResult.success(stack)` 表示成功使用，`TypedActionResult.pass(stack)` 表示不处理。`onEntityUse(ItemStack, LivingEntity, LivingEntity)` 定义对实体使用的逻辑。`inventoryTick(ItemStack, World, Entity, int)` 定义物品在玩家物品栏中每 tick 的逻辑。`postHit(ItemStack, LivingEntity, LivingEntity)` 定义攻击命中后的逻辑（适合工具损耗）。`postMine(ItemStack, World, BlockState, BlockPos, LivingEntity)` 定义挖掘方块后的逻辑。

### ArmorItem 盔甲命令

创建盔甲使用 `ArmorItem` 和 `ArmorMaterial`。`ArmorMaterial` 需要实现方法：`getDurability(ArmorItem.Type)` 返回各部件耐久度，`getProtection(ArmorItem.Type)` 返回各部件防护值，`getEnchantability()` 返回附魔等级，`getEquipSound()` 返回装备音效，`getRepairIngredient()` 返回修复材料，`getName()` 返回材质名称。`ArmorItem` 构造函数：`new ArmorItem(ArmorMaterial material, ArmorItem.Type type, Settings settings)`。Type 可以是 `HEAD`、`CHEST`、`LEGS`、`FEET`。

## 合成配方命令

### ShapedRecipeJsonBuilder 有形配方命令

使用数据生成器（DataGen）生成有形合成配方。基本命令格式：`ShapedRecipeJsonBuilder.create(getItemConvertible(output), count).pattern("AAA").pattern("A A").pattern(" A ").input('A', inputItem).criterion(hasItem(inputItem), conditionsFromItem(inputItem)).offerTo(exporter)`。`pattern()` 定义配方形状，最多三行，相同字符表示相同材料，空格表示空位。`input(char, ItemConvertible)` 定义字符对应的材料。

### ShapelessRecipeJsonBuilder 无形配方命令

无形配方（自由摆放配方）生成命令：`ShapelessRecipeJsonBuilder.create(getItemConvertible(output), count).input(inputItem1).input(inputItem2).criterion(hasItem(inputItem1), conditionsFromItem(inputItem1)).offerTo(exporter)`。无形配方没有形状限制，材料可以任意位置摆放。

### SmithingRecipeJsonBuilder 锻造配方命令

下界合金升级锻造配方：`SmithingRecipeJsonBuilder.create(template, base, addition, result).criterion(hasItem(base), conditionsFromItem(base)).offerTo(exporter)`。template 是模板物品（如下界合金锭），base 是基础物品（如钻石装备），addition 是添加物品（如下界合金锭），result 是结果物品。

## 构建和测试命令

使用 `./gradlew build` 构建模组，使用 `./gradlew runClient` 测试。物品模型 JSON 文件放在 `src/main/resources/assets/{modid}/models/item/` 目录，语言文件放在 `src/main/resources/assets/{modid}/lang/` 目录。数据生成器可以自动生成这些文件。
