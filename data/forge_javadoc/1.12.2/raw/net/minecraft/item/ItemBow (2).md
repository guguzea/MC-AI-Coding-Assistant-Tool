---
title: "ItemBow"
description: "public class ItemBow extends Item"
package: "net/minecraft/item"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/item/ItemBow.html"
sourceType: javadoc
---

# ItemBow

## Class signature

```java
public class ItemBow extends Item
```

## Constructors

- `public ItemBow()`

## Methods

- `protected ItemStack findAmmo( EntityPlayer player)`
- `protected boolean isArrow( ItemStack stack)`
- `public void onPlayerStoppedUsing( ItemStack stack, World worldIn, EntityLivingBase entityLiving, int timeLeft)`
- `public static float getArrowVelocity(int charge)`
- `public int getMaxItemUseDuration( ItemStack stack)`
- `public EnumAction getItemUseAction( ItemStack stack)`
- `public ActionResult < ItemStack > onItemRightClick( World worldIn, EntityPlayer playerIn, EnumHand handIn)`
- `public int getItemEnchantability()`
- `public EntityArrow customizeArrow( EntityArrow arrow)`
