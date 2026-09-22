---
title: "BlockFire"
description: "public class BlockFire extends Block"
package: "net/minecraft/block"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/block/BlockFire.html"
sourceType: javadoc
---

# BlockFire

**Inheritance:** java.lang.Object → net.minecraft.block.Block → net.minecraft.block.BlockFire

## Class signature

```java
public class BlockFire extends Block
```

## Constructors

- `BlockFire()`

## Methods

- `@Deprecated boolean canCatchFire(IBlockAccess worldIn, BlockPos pos)`
- `boolean canCatchFire(IBlockAccess world, BlockPos pos, EnumFacing face)` — Side sensitive version that calls the block function.
- `protected boolean canDie(World worldIn, BlockPos pos)`
- `boolean canPlaceBlockAt(World worldIn, BlockPos pos)`
- `protected BlockState createBlockState()`
- `IBlockState getActualState(IBlockState state, IBlockAccess worldIn, BlockPos pos)` — Get the actual Block state of this Block at the given position.
- `EnumWorldBlockLayer getBlockLayer()`
- `AxisAlignedBB getCollisionBoundingBox(World worldIn, BlockPos pos, IBlockState state)`
- `@Deprecated int getEncouragement(Block blockIn)`
- `@Deprecated int getFlammability(Block blockIn)`
- `MapColor getMapColor(IBlockState state)` — Get the MapColor for this Block and the given BlockState
- `int getMetaFromState(IBlockState state)` — Convert the BlockState into the correct metadata value
- `IBlockState getStateFromMeta(int meta)` — Convert the given metadata into a BlockState for this Block
- `static void init()`
- `boolean isCollidable()` — Returns if this block is collidable (only used by Fire).
- `boolean isFullCube()`
- `boolean isOpaqueCube()` — Used to determine ambient occlusion and culling when rebuilding chunks for render
- `void onBlockAdded(World worldIn, BlockPos pos, IBlockState state)`
- `void onNeighborBlockChange(World worldIn, BlockPos pos, IBlockState state, Block neighborBlock)` — Called when a neighboring block changes.
- `int quantityDropped(java.util.Random random)` — Returns the quantity of items to drop on block destruction.
- `void randomDisplayTick(World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `boolean requiresUpdates()`
- `void setFireInfo(Block blockIn, int encouragement, int flammability)`
- `int tickRate(World worldIn)` — How many world ticks before ticking
- `void updateTick(World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`

## Fields

- `static PropertyInteger AGE`
- `static PropertyBool ALT`
- `static PropertyBool EAST`
- `static PropertyBool FLIP`
- `static PropertyBool NORTH`
- `static PropertyBool SOUTH`
- `static PropertyInteger UPPER`
- `static PropertyBool WEST`
