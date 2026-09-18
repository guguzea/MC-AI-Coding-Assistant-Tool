---
title: "ItemFood"
description: "public class ItemFood extends Item"
package: "net/minecraft/item"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/item/ItemFood.html"
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

- `@Nullable public ItemStack onItemUseFinish( ItemStack stack, World worldIn, EntityLivingBase entityLiving)`
- `protected void onFoodEaten( ItemStack stack, World worldIn, EntityPlayer player)`
- `public int getMaxItemUseDuration( ItemStack stack)`
- `public EnumAction getItemUseAction( ItemStack stack)`
- `public ActionResult < ItemStack > onItemRightClick( ItemStack itemStackIn, World worldIn, EntityPlayer playerIn, EnumHand hand)`
- `public int getHealAmount( ItemStack stack)`
- `public float getSaturationModifier( ItemStack stack)`
- `public boolean isWolfsFavoriteMeat()`
- `public ItemFood setPotionEffect( PotionEffect p_185070_1_, float p_185070_2_)`
- `public ItemFood setAlwaysEdible()`
