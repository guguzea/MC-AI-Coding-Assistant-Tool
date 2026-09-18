---
title: "ItemBucketMilk"
description: "Called from ItemStack.setItem, will hold extra data for the life of this ItemStack."
package: "net/minecraft/item"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/item/ItemBucketMilk.html"
sourceType: javadoc
---

# ItemBucketMilk

## Class signature

```java
public class ItemBucketMilk extends Item
```

## Constructors

- `public ItemBucketMilk()`

## Methods

- `public ItemStack onItemUseFinish( ItemStack stack, World worldIn, EntityLivingBase entityLiving)`
- `public int getMaxItemUseDuration( ItemStack stack)`
- `public EnumAction getItemUseAction( ItemStack stack)`
- `public ActionResult < ItemStack > onItemRightClick( World worldIn, EntityPlayer playerIn, EnumHand handIn)`
- `public ICapabilityProvider initCapabilities( ItemStack stack, NBTTagCompound nbt)`

## Description

Called from ItemStack.setItem, will hold extra data for the life of this ItemStack.
