---
title: "ItemBucket"
description: "Called from ItemStack.setItem, will hold extra data for the life of this ItemStack."
package: "net/minecraft/item"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/item/ItemBucket.html"
sourceType: javadoc
---

# ItemBucket

## Class signature

```java
public class ItemBucket extends Item
```

## Constructors

- `public ItemBucket( Block containedBlockIn)`

## Methods

- `public ActionResult < ItemStack > onItemRightClick( World worldIn, EntityPlayer playerIn, EnumHand handIn)`
- `public boolean tryPlaceContainedLiquid( EntityPlayer player, World worldIn, BlockPos posIn)`
- `public ICapabilityProvider initCapabilities( ItemStack stack, NBTTagCompound nbt)`

## Description

Called from ItemStack.setItem, will hold extra data for the life of this ItemStack.
