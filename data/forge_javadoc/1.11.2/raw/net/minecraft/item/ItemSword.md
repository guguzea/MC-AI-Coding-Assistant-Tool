---
title: "ItemSword"
description: "public class ItemSword extends Item"
package: "net/minecraft/item"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/item/ItemSword.html"
sourceType: javadoc
---

# ItemSword

## Class signature

```java
public class ItemSword extends Item
```

## Constructors

- `public ItemSword( Item.ToolMaterial material)`

## Methods

- `public float getDamageVsEntity()`
- `public float getStrVsBlock( ItemStack stack, IBlockState state)`
- `public boolean hitEntity( ItemStack stack, EntityLivingBase target, EntityLivingBase attacker)`
- `public boolean onBlockDestroyed( ItemStack stack, World worldIn, IBlockState state, BlockPos pos, EntityLivingBase entityLiving)`
- `public boolean canHarvestBlock( IBlockState blockIn)`
- `public boolean isFull3D()`
- `public int getItemEnchantability()`
- `public java.lang.String getToolMaterialName()`
- `public boolean getIsRepairable( ItemStack toRepair, ItemStack repair)`
- `public com.google.common.collect.Multimap<java.lang.String, AttributeModifier > getItemAttributeModifiers( EntityEquipmentSlot equipmentSlot)`
