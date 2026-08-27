---
description: 03 — 物品开发
---

# 03 — 物品开发

> 适用版本：Forge 1.15.2

---

## 约束

### Item 子类规范

- 基础物品类继承 `Item`（`net.minecraft.item.Item`）
- 禁止重写已废弃的 `onCreated()` 等方法
- 物品必须通过 `DeferredRegister<Item>` 注册

### Item.Properties 配置

```java
new Item.Properties()
    .maxStackSize(int maxStackSize)                 // 默认 64
    .maxDamage(int maxDamage)                      // 有耐久物品
    .defaultMaxDamage(int maxDamage)               // 只在尚未设置 maxDamage 时写入
    .containerItem(Item copyFrom)                  // 消耗后保留物品（官方文档名 containerItem）
    .rarity(Rarity rarity)                         // COMMON, UNCOMMON, RARE, EPIC
    .group(ItemGroup group)                        // 创造栏（官方文档是 group，不是 tab）
    .setNoRepair()
    .addToolType(ToolType type, int harvestLevel)  // 官方 1.15.x items 页
```

### ItemTier（工具材料）规范

```java
public enum MyItemTier implements IItemTier {
    MY_MATERIAL(4, 2000, 10.0f, 4.0f, 20, () -> Ingredient.fromItems(Items.DIAMOND));

    // getHarvestLevel(), getMaxUses(), getEfficiency(), getAttackDamage(), getEnchantability(), getRepairMaterial()
}
```

- `getHarvestLevel()`：挖掘等级（木=0，石=1，铁=2，金=3，钻=4；1.15.2 无下界合金）
- `getMaxUses()`：耐久值
- `getEfficiency()`：挖掘速度
- `getAttackDamage()`：附加攻击伤害
- `getEnchantability()`：附魔能力值

### 食物属性（Food）

```java
new Item.Properties()
    .food(new Food.Builder()
        .hunger(int hunger)                 // 恢复的饥饿值
        .saturation(float saturation)       // 饱和度
        .meat()                             // 狗可食用
        .setAlwaysEdible()                  // 饱食也能吃（不是 alwaysEat）
        .fastToEat()
        .effect(() -> new EffectInstance(Effects.JUMP_BOOST, 200), 1.0f)
        .build()
    )
```

### 注册约束

- BlockItem 关联方块时，registry name 必须与方块完全相同
- 工具/盔甲使用 `IItemTier` 时，需要在构造中传入工具属性
- **物品的创造栏通过 `.group(ItemGroup)` 设置**（1.15.2 官方文档方法名是 `group`）

---

## Decision Flow

### Decision: 需要什么类型的物品？

```
IF 需要可放置的基础方块物品
  → 注册 BlockItem（关联已有的方块）
  → 不需要新建 Item 子类

IF 需要普通物品（无特殊功能）
  → extends Item，使用默认属性
  → 最简单的物品

IF 需要工具（剑、镐、斧、铲）
  → SwordItem / PickaxeItem / AxeItem / ShovelItem（镐斧铲父类是 ToolItem）
  → 需要定义 IItemTier
  → SwordItem(IItemTier, int attackDamageIn, float attackSpeedIn, Item.Properties)

IF 需要盔甲
  → extends ArmorItem
  → 需要定义 IArmorMaterial
  → 需要在 constructor 传入：material, slot, properties

IF 需要食物（可食用物品）
  → extends Item + 设置 .food()
  → 或覆盖 onItemUseFinish() 做自定义食用后逻辑

IF 需要可耐久物品
  → 设置 .durability(maxDamage)
  → 覆盖 hitEntity() 处理攻击耐久
  → 覆盖 onItemUse(ItemUseContext) 处理方块交互

IF 需要附魔书以外的附魔物品
  → 不支持，Forge 1.15.2 附魔只能通过附魔台/附魔桌

IF 需要鞘翅、火焰弹等特殊物品
  → 参考 Forge 源码或示例模组
  → 通常需要自定义渲染器
```

### Decision: IItemTier 定义

```
IF 自定义工具材料
  → 定义枚举实现 IItemTier 接口
  → 6 个必需方法全部实现（含 getRepairMaterial）
  → getRepairMaterial() 必须返回有效的 Ingredient
  → SwordItem(tier, int attackDamageIn, float attackSpeedIn, properties)

IF 复用现有材料
  → ItemTier.WOOD / ItemTier.STONE / ItemTier.IRON / ItemTier.GOLD / ItemTier.DIAMOND
```

### Decision: 物品放置在哪个 Creative Tab

```
IF 建筑方块 → ItemGroup.BUILDING_BLOCKS
IF 装饰 → ItemGroup.DECORATIONS
IF 工具 → ItemGroup.TOOLS
IF 武器 → ItemGroup.COMBAT
IF 食物 → ItemGroup.FOOD
IF 材料 → ItemGroup.MATERIALS
IF 红石 → ItemGroup.REDSTONE
IF 交通 → ItemGroup.TRANSPORTATION
IF 杂项 → ItemGroup.MISC
```

---

## 示例：基础物品

```java
// items/MyItem.java
public class MyItem extends Item {
    public MyItem() {
        super(new Item.Properties()
            .maxStackSize(64)
            .group(ItemGroup.MISC)
        );
    }

    @Override
    public ActionResultType onItemUse(ItemUseContext context) {
        // 右键点击方块时的逻辑
        return ActionResultType.SUCCESS;
    }
}
```

## 示例：工具（剑）

```java
// items/MyTier.java
public enum MyTier implements IItemTier {
    MY_MATERIAL(3, 1561, 8.0f, 3.0f, 15, () -> Ingredient.fromItems(Items.DIAMOND));

    private final int level;
    private final int uses;
    private final float speed;
    private final float damage;         // 工具的基础伤害加成（不含类型加成）
    private final int enchantmentValue;
    private final Supplier<Ingredient> repairIngredient;

    MyTier(int level, int uses, float speed, float damage, int enchantmentValue, Supplier<Ingredient> repairIngredient) {
        this.level = level;
        this.uses = uses;
        this.speed = speed;
        this.damage = damage;
        this.enchantmentValue = enchantmentValue;
        this.repairIngredient = repairIngredient;
    }

    @Override public int getHarvestLevel() { return level; }
    @Override public int getMaxUses() { return uses; }
    @Override public float getEfficiency() { return speed; }
    @Override public float getAttackDamage() { return damage; }
    @Override public int getEnchantability() { return enchantmentValue; }
    @Override public Ingredient getRepairMaterial() { return repairIngredient.get(); }
}
```

```java
// 注册剑
// IItemTier.getAttackDamage() + 3.0f（剑的类型加成）= 总攻击伤害
// SwordItem(IItemTier, int attackDamageIn, float attackSpeedIn, Item.Properties)
public static final RegistryObject<Item> MY_SWORD = ITEMS.register("my_sword",
    () -> new SwordItem(MyTier.MY_MATERIAL, 3, -2.4f, new Item.Properties()
        .group(ItemGroup.COMBAT)
    )
);
// 创造栏通过 .group() 放到 ItemGroup.COMBAT
```

## 示例：盔甲

```java
// items/MyArmorMaterial.java
public enum MyArmorMaterial implements IArmorMaterial {
    MY_MATERIAL("my_material", 40, new int[]{4, 7, 9, 4}, 20,
        SoundEvents.ITEM_ARMOR_EQUIP_DIAMOND, 3.0f);

    // getDurability(EquipmentSlotType), getDamageReductionAmount(EquipmentSlotType), getEnchantability(),
    // getSoundEvent(), getToughness(), getRepairMaterial(), getName()
    // 1.15.2 IArmorMaterial 没有 getKnockbackResistance
}
```

```java
// items/MyArmorItem.java
public class MyArmorItem extends ArmorItem {
    public MyArmorItem(MyArmorMaterial material, EquipmentSlotType slot, Item.Properties properties) {
        super(material, slot, properties);
    }
}
```

## 示例：食物

```java
// items/MyFoodItem.java
public class MyFoodItem extends Item {
    public MyFoodItem() {
        super(new Item.Properties()
            .food(new Food.Builder()
                .hunger(4)
                .saturation(0.3f)
                .meat()
                .effect(() -> new EffectInstance(Effects.JUMP_BOOST, 200, 1), 1.0f)
                .build())
            .group(ItemGroup.FOOD)
        );
    }

    @Override
    public ItemStack onItemUseFinish(ItemStack stack, World world, LivingEntity entity) {
        super.onItemUseFinish(stack, world, entity);
        return stack;
    }
}
// 创造栏通过 .group() 放到 ItemGroup.FOOD
```

> 注：1.15.2 `Food.Builder.effect` 非过时重载是 `Supplier<EffectInstance>`；`EffectInstance` 直接传入的重载已 `@Deprecated`。效果字段用 `Effects.JUMP_BOOST`（MCP），不是 Yarn `StatusEffects` / Mojmap `MobEffects.JUMP`。
