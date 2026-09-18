---
title: "DemoWorldManager"
description: "Activate the clicked on block, otherwise use the held item."
package: "net/minecraft/world/demo"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/world/demo/DemoWorldManager.html"
sourceType: javadoc
---

# DemoWorldManager

## Class signature

```java
public class DemoWorldManager extends ItemInWorldManager
```

## Constructors

- `public DemoWorldManager( World worldIn)`

## Methods

- `public void updateBlockRemoving()`
- `public void onBlockClicked( BlockPos pos, EnumFacing side)`
- `public void blockRemoving( BlockPos pos)`
- `public boolean tryHarvestBlock( BlockPos pos)`
- `public boolean tryUseItem( EntityPlayer player, World worldIn, ItemStack stack)`
- `public boolean activateBlockOrUseItem( EntityPlayer player, World worldIn, ItemStack stack, BlockPos pos, EnumFacing side, float offsetX, float offsetY, float offsetZ)`

## Description

Activate the clicked on block, otherwise use the held item.
