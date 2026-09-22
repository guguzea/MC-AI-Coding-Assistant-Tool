---
title: "DemoWorldManager"
description: "public class DemoWorldManager extends ItemInWorldManager"
package: "net/minecraft/world/demo"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/world/demo/DemoWorldManager.html"
sourceType: javadoc
---

# DemoWorldManager

**Inheritance:** java.lang.Object → net.minecraft.server.management.ItemInWorldManager → net.minecraft.world.demo.DemoWorldManager

## Class signature

```java
public class DemoWorldManager extends ItemInWorldManager
```

## Methods

- `boolean activateBlockOrUseItem(EntityPlayer player, World worldIn, ItemStack stack, BlockPos pos, EnumFacing side, float offsetX, float offsetY, float offsetZ)` — Activate the clicked on block, otherwise use the held item.
- `void blockRemoving(BlockPos pos)`
- `void onBlockClicked(BlockPos pos, EnumFacing side)` — If not creative, it calls sendBlockBreakProgress until the block is broken first. tryHarvestBlock can also be the result of this call.
- `boolean tryHarvestBlock(BlockPos pos)` — Attempts to harvest a block
- `boolean tryUseItem(EntityPlayer player, World worldIn, ItemStack stack)` — Attempts to right-click use an item by the given EntityPlayer in the given World
- `void updateBlockRemoving()`

## Fields

- `DemoWorldManager`
