---
title: "BlockFurnace"
description: "public class BlockFurnace extends BlockContainer"
package: "net/minecraft/block"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/block/BlockFurnace.html"
sourceType: javadoc
---

# BlockFurnace

**Inheritance:** java.lang.Object → net.minecraft.block.Block → net.minecraft.block.BlockContainer → net.minecraft.block.BlockFurnace

## Class signature

```java
public class BlockFurnace extends BlockContainer
```

## Constructors

- `BlockFurnace(boolean isBurning)`

## Methods

- `void breakBlock(World worldIn, BlockPos pos, IBlockState state)`
- `protected BlockState createBlockState()`
- `TileEntity createNewTileEntity(World worldIn, int meta)` — Returns a new instance of a block's tile entity class.
- `int getComparatorInputOverride(World worldIn, BlockPos pos)`
- `Item getItem(World worldIn, BlockPos pos)`
- `Item getItemDropped(IBlockState state, java.util.Random rand, int fortune)` — Get the Item that this Block should drop when harvested.
- `int getMetaFromState(IBlockState state)` — Convert the BlockState into the correct metadata value
- `int getRenderType()` — The type of render function called. 3 for standard block models, 2 for TESR's, 1 for liquids, -1 is no render
- `IBlockState getStateForEntityRender(IBlockState state)` — Possibly modify the given BlockState before rendering it on an Entity (Minecarts, Endermen, ...)
- `IBlockState getStateFromMeta(int meta)` — Convert the given metadata into a BlockState for this Block
- `boolean hasComparatorInputOverride()`
- `boolean onBlockActivated(World worldIn, BlockPos pos, IBlockState state, EntityPlayer playerIn, EnumFacing side, float hitX, float hitY, float hitZ)`
- `void onBlockAdded(World worldIn, BlockPos pos, IBlockState state)`
- `IBlockState onBlockPlaced(World worldIn, BlockPos pos, EnumFacing facing, float hitX, float hitY, float hitZ, int meta, EntityLivingBase placer)` — Called by ItemBlocks just before a block is actually set in the world, to allow for adjustments to the IBlockstate
- `void onBlockPlacedBy(World worldIn, BlockPos pos, IBlockState state, EntityLivingBase placer, ItemStack stack)` — Called by ItemBlocks after a block is set in the world, to allow post-place logic
- `void randomDisplayTick(World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `static void setState(boolean active, World worldIn, BlockPos pos)`

## Fields

- `static PropertyDirection FACING`
