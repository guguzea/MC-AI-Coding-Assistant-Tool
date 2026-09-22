# ItemArmor.ArmorMaterial

**Inheritance:** java.lang.Object → java.lang.Enum<ItemArmor.ArmorMaterial> → net.minecraft.item.ItemArmor.ArmorMaterial

## Class signature

```java
public static enum ItemArmor.ArmorMaterial extends java.lang.Enum<ItemArmor.ArmorMaterial>
```

## Methods

- `int getDamageReductionAmount(int armorType)` — Return the damage reduction (each 1 point is a half a shield on gui) of the piece index passed (0 = helmet, 1 = plate, 2 = legs and 3 = boots)
- `int getDurability(int armorType)` — Returns the durability for a armor slot of for this type.
- `int getEnchantability()` — Return the enchantability factor of the material.
- `java.lang.String getName()`
- `Item getRepairItem()` — Get a main crafting component of this Armor Material (example is Items.iron_ingot)
- `static ItemArmor.ArmorMaterial valueOf(java.lang.String name)` — Returns the enum constant of this type with the specified name.
- `static ItemArmor.ArmorMaterial [] values()` — Returns an array containing the constants of this enum type, in the order they are declared.

## Fields

- `Item customCraftingMaterial`