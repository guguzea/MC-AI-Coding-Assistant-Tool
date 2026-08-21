---
name: mc-item
description: Minecraft Forge 物品开发。创建物品、工具（剑/镐/斧）、盔甲、食物。触发词：物品、Item、ItemStack、Item.Properties、ToolMaterial、SwordItem、ArmorItem、ItemGroup
platform: forge
version: "1.13.2"
dependencies: []
mappings: mcp
---

# 物品开发（Forge 1.13.2）

## 快速开始

```java
// 注册（参见 mc-registry Skill）
public static final Item MY_ITEM = new Item(
    new Item.Properties()
        .group(ItemGroup.MISC)
        .maxStackSize(64)
);

@SubscribeEvent
public void onItemsRegistry(RegistryEvent.Register<Item> event) {
    event.getRegistry().register(
        MY_ITEM.setRegistryName(new ResourceLocation(MOD_ID, "my_item"))
    );
}
```

## Decision: 选择物品类型

```
IF 只是手持物品（无特殊行为）
  → Item

IF 剑/工具（影响挖掘速度、攻击伤害）
  → ItemSword / ItemPickaxe / ItemAxe / ItemSpade（不是 SwordItem / PickaxeItem）

IF 盔甲
  → ItemArmor + IArmorMaterial

IF 可食用
  → 子类化 Item 覆盖 onItemUseFinish 等；或 ItemFood#setAlwaysEdible()

IF 可在 ItemGroup 中找到
  → 设置 .group(ItemGroup)（字段是 MISC / TOOLS / COMBAT，不是 TAB_MISC）
```

## 工具层级 IItemTier

```java
public enum MyTier implements IItemTier {
    MY_MATERIAL(3, 1561, 8.0f, 3.0f, 15, () -> Ingredient.fromItems(Items.DIAMOND));

    private final int harvestLevel;
    private final int maxUses;
    private final float efficiency;
    private final float attackDamage;
    private final int enchantability;
    private final Ingredient repairMaterial;

    MyTier(int harvestLevel, int maxUses, float efficiency, float attackDamage,
           int enchantability, Supplier<Ingredient> repairMaterial) {
        this.harvestLevel = harvestLevel;
        this.maxUses = maxUses;
        this.efficiency = efficiency;
        this.attackDamage = attackDamage;
        this.enchantability = enchantability;
        this.repairMaterial = repairMaterial;
    }

    @Override public int getHarvestLevel() { return harvestLevel; }
    @Override public float getEfficiency() { return efficiency; }
    @Override public float getAttackDamage() { return attackDamage; }
    @Override public int getEnchantability() { return enchantability; }
    @Override public Ingredient getRepairMaterial() { return repairMaterial.get(); }
}
```

## 剑（ItemSword）

```java
public static final Item MY_SWORD = new ItemSword(MyTier.MY_MATERIAL, 3, 1.6f,
    new Item.Properties().group(ItemGroup.COMBAT));
```

**攻击伤害计算：**
- `ItemSword(IItemTier, int damage, float speed, Item.Properties)` 的 damage 参数是基础加成
- **最终攻击伤害 = damage + 3.0f（剑类内置固定加成）**
- 例如：传 `3` → 最终伤害 = 3 + 3.0 = **6.0**

**攻击速度参考值：** 钻石剑默认 1.6f

## 盔甲

```java
public enum MyArmorMaterial implements IArmorMaterial {
    MY_MATERIAL("my_material", 40, new int[]{4, 7, 9, 4}, 20,
        SoundEvents.BLOCK_ANVIL_PLACE, 3.0f, 0.1f);

    private final String name;
    private final int durability;
    private final int[] damageReduction;
    private final int enchantability;
    private final SoundEvent sound;
    private final float toughness;
    private final float knockbackResistance;

    MyArmorMaterial(String name, int durability, int[] damageReduction,
                   int enchantability, SoundEvent sound,
                   float toughness, float knockbackResistance) {
        this.name = name;
        this.durability = durability;
        this.damageReduction = damageReduction;
        this.enchantability = enchantability;
        this.sound = sound;
        this.toughness = toughness;
        this.knockbackResistance = knockbackResistance;
    }

    @Override public String getName() { return name; }
    @Override public int getDurability(EquipmentSlotType slot) { return durability; }
    @Override public int getDamageReductionAmount(EquipmentSlotType slot) { return damageReduction[slot.getIndex()]; }
    @Override public int getEnchantability() { return enchantability; }
    @Override public SoundEvent getSoundEvent() { return sound; }
    @Override public float getToughness() { return toughness; }
    @Override public float getKnockbackResistance() { return knockbackResistance; }
}

public static final Item MY_HELMET = new ItemArmor(MyArmorMaterial.MY_MATERIAL,
    EquipmentSlotType.HEAD,
    new Item.Properties().group(ItemGroup.COMBAT));
```

## 食物

1.13.2 `Item.Properties` **没有** `.food()` / `.saturation()` / `.effect()`。

```java
public class MyFood extends ItemFood {
    public MyFood() {
        super(4, 0.3f, false, new Item.Properties().group(ItemGroup.FOOD));
        setAlwaysEdible();
    }
}
```

## 常见错误

- ❌ `ItemGroup.TAB_MISC` — 用 `ItemGroup.MISC`
- ❌ `SwordItem` / `PickaxeItem` — MCP 是 `ItemSword` / `ItemPickaxe`
- ❌ `.saturation()` / `.effect()` on Properties — 用 `ItemFood` 或子类化 `Item`
- ❌ 忘记 `maxStackSize`（默认 64）
- ❌ 忘记 `.group()` 导致物品不在任何标签页

## 参考资料

- 详细示例：参见 `03-item.mdc`

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | 物品通过 RegistryEvent.Register<Item> 注册 |
| `mc-block` | ItemBlock 需要先有方块 |
| `mc-capability` | ItemStack 可附加 Capability |
