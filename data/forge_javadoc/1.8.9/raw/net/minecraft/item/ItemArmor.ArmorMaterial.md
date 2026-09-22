---
title: "ItemArmor.ArmorMaterial"
description: "public static enum ItemArmor.ArmorMaterial extends java.lang.Enum<ItemArmor.ArmorMaterial>"
package: "net/minecraft/item"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/item/ItemArmor.ArmorMaterial.html"
sourceType: javadoc
---

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
