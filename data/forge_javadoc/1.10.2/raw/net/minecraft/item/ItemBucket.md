---
title: "ItemBucket"
description: "Called from ItemStack.setItem, will hold extra data for the life of this ItemStack."
package: "net/minecraft/item"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/item/ItemBucket.html"
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

- `public ActionResult < ItemStack > onItemRightClick( ItemStack itemStackIn, World worldIn, EntityPlayer playerIn, EnumHand hand)`
- `public boolean tryPlaceContainedLiquid(@Nullable EntityPlayer player, World worldIn, BlockPos posIn)`
- `public ICapabilityProvider initCapabilities( ItemStack stack, NBTTagCompound nbt)`

## Description

Called from ItemStack.setItem, will hold extra data for the life of this ItemStack.
