---
title: "BlockNewLog"
description: "public class BlockNewLog extends BlockLog"
package: "net/minecraft/block"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/block/BlockNewLog.html"
sourceType: javadoc
---

# BlockNewLog

**Inheritance:** java.lang.Object → net.minecraft.block.Block → net.minecraft.block.BlockRotatedPillar → net.minecraft.block.BlockLog → net.minecraft.block.BlockNewLog

## Class signature

```java
public class BlockNewLog extends BlockLog
```

## Constructors

- `BlockNewLog()`

## Methods

- `protected BlockState createBlockState()`
- `protected ItemStack createStackedBlock(IBlockState state)`
- `int damageDropped(IBlockState state)` — Gets the metadata of the item this Block can drop.
- `MapColor getMapColor(IBlockState state)` — Get the MapColor for this Block and the given BlockState
- `int getMetaFromState(IBlockState state)` — Convert the BlockState into the correct metadata value
- `IBlockState getStateFromMeta(int meta)` — Convert the given metadata into a BlockState for this Block
- `void getSubBlocks(Item itemIn, CreativeTabs tab, java.util.List<ItemStack> list)` — returns a list of blocks with the same ID, but different meta (eg: wood returns 4 blocks)

## Fields

- `static PropertyEnum<BlockPlanks.EnumType> VARIANT`
