---
title: "ItemMonsterPlacer"
description: "public class ItemMonsterPlacer extends Item"
package: "net/minecraft/item"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/item/ItemMonsterPlacer.html"
sourceType: javadoc
---

# ItemMonsterPlacer

## Class signature

```java
public class ItemMonsterPlacer extends Item
```

## Constructors

- `public ItemMonsterPlacer()`

## Methods

- `public java.lang.String getItemStackDisplayName( ItemStack stack)`
- `public EnumActionResult onItemUse( ItemStack stack, EntityPlayer playerIn, World worldIn, BlockPos pos, EnumHand hand, EnumFacing facing, float hitX, float hitY, float hitZ)`
- `public static void applyItemEntityDataToEntity( World entityWorld, @Nullable EntityPlayer player, ItemStack stack, @Nullable Entity targetEntity)`
- `public ActionResult < ItemStack > onItemRightClick( ItemStack itemStackIn, World worldIn, EntityPlayer playerIn, EnumHand hand)`
- `@Nullable public static Entity spawnCreature( World worldIn, @Nullable java.lang.String entityID, double x, double y, double z)`
- `public void getSubItems( Item itemIn, CreativeTabs tab, java.util.List< ItemStack > subItems)`
- `public static void applyEntityIdToItemStack( ItemStack stack, java.lang.String entityId)`
- `@Nullable public static java.lang.String getEntityIdFromItem( ItemStack stack)`
