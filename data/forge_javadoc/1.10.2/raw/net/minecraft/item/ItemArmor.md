---
title: "ItemArmor"
description: "public class ItemArmor extends Item"
package: "net/minecraft/item"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/item/ItemArmor.html"
sourceType: javadoc
---

# ItemArmor

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.IForgeRegistryEntry.Impl<Item> → net.minecraft.item.Item → net.minecraft.item.ItemArmor

## Class signature

```java
public class ItemArmor extends Item
```

## Constructors

- `ItemArmor(ItemArmor.ArmorMaterial materialIn, int renderIndexIn, EntityEquipmentSlot equipmentSlotIn)`

## Methods

- `static ItemStack dispenseArmor(IBlockSource blockSource, ItemStack stack)`
- `ItemArmor.ArmorMaterial getArmorMaterial()`
- `int getColor(ItemStack stack)`
- `EntityEquipmentSlot getEquipmentSlot()`
- `boolean getIsRepairable(ItemStack toRepair, ItemStack repair)`
- `com.google.common.collect.Multimap<java.lang.String, AttributeModifier> getItemAttributeModifiers(EntityEquipmentSlot equipmentSlot)`
- `int getItemEnchantability()`
- `boolean hasColor(ItemStack stack)`
- `boolean hasOverlay(ItemStack stack)` — Determines if this armor will be rendered with the secondary 'overlay' texture.
- `ActionResult<ItemStack> onItemRightClick(ItemStack itemStackIn, World worldIn, EntityPlayer playerIn, EnumHand hand)`
- `void removeColor(ItemStack stack)`
- `void setColor(ItemStack stack, int color)`

## Fields

- `EntityEquipmentSlot armorType`
- `int damageReduceAmount`
- `static IBehaviorDispenseItem DISPENSER_BEHAVIOR`
- `static java.lang.String[] EMPTY_SLOT_NAMES`
- `int renderIndex`
- `float toughness`
