# Item.ToolMaterial

**Inheritance:** java.lang.Object → java.lang.Enum<Item.ToolMaterial> → net.minecraft.item.Item.ToolMaterial

## Class signature

```java
public static enum Item.ToolMaterial extends java.lang.Enum<Item.ToolMaterial>
```

## Methods

- `float getDamageVsEntity()` — Returns the damage against a given entity.
- `float getEfficiencyOnProperMaterial()` — The strength of this tool material against blocks which it is effective against.
- `int getEnchantability()` — Return the natural enchantability factor of the material.
- `int getHarvestLevel()` — The level of material this tool can harvest (3 = DIAMOND, 2 = IRON, 1 = STONE, 0 = IRON/GOLD)
- `int getMaxUses()` — The number of uses this material allows.
- `@Deprecated Item getRepairItem()`
- `ItemStack getRepairItemStack()`
- `Item.ToolMaterial setRepairItem(ItemStack stack)`
- `static Item.ToolMaterial valueOf(java.lang.String name)` — Returns the enum constant of this type with the specified name.
- `static Item.ToolMaterial [] values()` — Returns an array containing the constants of this enum type, in the order they are declared.

## Fields

- `Item customCraftingMaterial`