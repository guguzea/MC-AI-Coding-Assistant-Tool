---
title: "BlockSnow"
description: "public class BlockSnow extends Block"
package: "net/minecraft/block"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/block/BlockSnow.html"
sourceType: javadoc
---

# BlockSnow

**Inheritance:** java.lang.Object → net.minecraft.block.Block → net.minecraft.block.BlockSnow

## Class signature

```java
public class BlockSnow extends Block
```

## Constructors

- `BlockSnow()`

## Methods

- `boolean canPlaceBlockAt(World worldIn, BlockPos pos)`
- `protected BlockState createBlockState()`
- `protected void getBoundsForLayers(int p_150154_1_)`
- `AxisAlignedBB getCollisionBoundingBox(World worldIn, BlockPos pos, IBlockState state)`
- `Item getItemDropped(IBlockState state, java.util.Random rand, int fortune)` — Get the Item that this Block should drop when harvested.
- `int getMetaFromState(IBlockState state)` — Convert the BlockState into the correct metadata value
- `IBlockState getStateFromMeta(int meta)` — Convert the given metadata into a BlockState for this Block
- `void harvestBlock(World worldIn, EntityPlayer player, BlockPos pos, IBlockState state, TileEntity te)`
- `boolean isFullCube()`
- `boolean isOpaqueCube()` — Used to determine ambient occlusion and culling when rebuilding chunks for render
- `boolean isPassable(IBlockAccess worldIn, BlockPos pos)`
- `boolean isReplaceable(World worldIn, BlockPos pos)` — Whether this Block can be replaced directly by other blocks (true for e.g. tall grass)
- `void onNeighborBlockChange(World worldIn, BlockPos pos, IBlockState state, Block neighborBlock)` — Called when a neighboring block changes.
- `int quantityDropped(IBlockState state, int fortune, java.util.Random random)` — State and fortune sensitive version, this replaces the old (int meta, Random rand) version in 1.1.
- `int quantityDropped(java.util.Random random)` — Returns the quantity of items to drop on block destruction.
- `void setBlockBoundsBasedOnState(IBlockAccess worldIn, BlockPos pos)`
- `void setBlockBoundsForItemRender()` — Sets the block's bounds for rendering it as an item
- `boolean shouldSideBeRendered(IBlockAccess worldIn, BlockPos pos, EnumFacing side)`
- `void updateTick(World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`

## Fields

- `static PropertyInteger LAYERS`
