---
title: "BlockRedstoneRepeater"
description: "public class BlockRedstoneRepeater extends BlockRedstoneDiode"
package: "net/minecraft/block"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/block/BlockRedstoneRepeater.html"
sourceType: javadoc
---

# BlockRedstoneRepeater

**Inheritance:** java.lang.Object → net.minecraft.block.Block → net.minecraft.block.BlockDirectional → net.minecraft.block.BlockRedstoneDiode → net.minecraft.block.BlockRedstoneRepeater

## Class signature

```java
public class BlockRedstoneRepeater extends BlockRedstoneDiode
```

## Constructors

- `BlockRedstoneRepeater(boolean powered)`

## Methods

- `void breakBlock(World worldIn, BlockPos pos, IBlockState state)`
- `protected boolean canPowerSide(Block blockIn)`
- `protected BlockState createBlockState()`
- `IBlockState getActualState(IBlockState state, IBlockAccess worldIn, BlockPos pos)` — Get the actual Block state of this Block at the given position.
- `protected int getDelay(IBlockState state)`
- `Item getItem(World worldIn, BlockPos pos)`
- `Item getItemDropped(IBlockState state, java.util.Random rand, int fortune)` — Get the Item that this Block should drop when harvested.
- `java.lang.String getLocalizedName()` — Gets the localized name of this block.
- `int getMetaFromState(IBlockState state)` — Convert the BlockState into the correct metadata value
- `protected IBlockState getPoweredState(IBlockState unpoweredState)`
- `IBlockState getStateFromMeta(int meta)` — Convert the given metadata into a BlockState for this Block
- `protected IBlockState getUnpoweredState(IBlockState poweredState)`
- `boolean isLocked(IBlockAccess worldIn, BlockPos pos, IBlockState state)`
- `boolean onBlockActivated(World worldIn, BlockPos pos, IBlockState state, EntityPlayer playerIn, EnumFacing side, float hitX, float hitY, float hitZ)`
- `void randomDisplayTick(World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`

## Fields

- `static PropertyInteger DELAY`
- `static PropertyBool LOCKED`
