---
title: "ItemMonsterPlacer"
description: "public class ItemMonsterPlacer extends Item"
package: "net/minecraft/item"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/item/ItemMonsterPlacer.html"
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
- `public EnumActionResult onItemUse( EntityPlayer player, World worldIn, BlockPos pos, EnumHand hand, EnumFacing facing, float hitX, float hitY, float hitZ)`
- `protected double getYOffset( World p_190909_1_, BlockPos p_190909_2_)`
- `public static void applyItemEntityDataToEntity( World entityWorld, @Nullable EntityPlayer player, ItemStack stack, @Nullable Entity targetEntity)`
- `public ActionResult < ItemStack > onItemRightClick( World worldIn, EntityPlayer playerIn, EnumHand handIn)`
- `@Nullable public static Entity spawnCreature( World worldIn, @Nullable ResourceLocation entityID, double x, double y, double z)`
- `public void getSubItems( Item itemIn, CreativeTabs tab, NonNullList < ItemStack > subItems)`
- `public static void applyEntityIdToItemStack( ItemStack stack, ResourceLocation entityId)`
- `@Nullable public static ResourceLocation getNamedIdFrom( ItemStack p_190908_0_)`
