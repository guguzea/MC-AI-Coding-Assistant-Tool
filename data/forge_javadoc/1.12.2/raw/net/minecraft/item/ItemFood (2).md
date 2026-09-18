---
title: "ItemFood"
description: "public class ItemFood extends Item"
package: "net/minecraft/item"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/item/ItemFood.html"
sourceType: javadoc
---

# ItemFood

## Class signature

```java
public class ItemFood extends Item
```

## Constructors

- `public ItemFood(int amount, float saturation, boolean isWolfFood)`
- `public ItemFood(int amount, boolean isWolfFood)`

## Methods

- `public ItemStack onItemUseFinish( ItemStack stack, World worldIn, EntityLivingBase entityLiving)`
- `protected void onFoodEaten( ItemStack stack, World worldIn, EntityPlayer player)`
- `public int getMaxItemUseDuration( ItemStack stack)`
- `public EnumAction getItemUseAction( ItemStack stack)`
- `public ActionResult < ItemStack > onItemRightClick( World worldIn, EntityPlayer playerIn, EnumHand handIn)`
- `public int getHealAmount( ItemStack stack)`
- `public float getSaturationModifier( ItemStack stack)`
- `public boolean isWolfsFavoriteMeat()`
- `public ItemFood setPotionEffect( PotionEffect effect, float probability)`
- `public ItemFood setAlwaysEdible()`
