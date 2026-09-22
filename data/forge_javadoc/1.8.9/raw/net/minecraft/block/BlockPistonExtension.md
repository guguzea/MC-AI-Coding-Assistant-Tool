---
title: "BlockPistonExtension"
description: "public class BlockPistonExtension extends Block"
package: "net/minecraft/block"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/block/BlockPistonExtension.html"
sourceType: javadoc
---

# BlockPistonExtension

**Inheritance:** java.lang.Object → net.minecraft.block.Block → net.minecraft.block.BlockPistonExtension

## Class signature

```java
public class BlockPistonExtension extends Block
```

## Constructors

- `BlockPistonExtension()`

## Methods

- `void addCollisionBoxesToList(World worldIn, BlockPos pos, IBlockState state, AxisAlignedBB mask, java.util.List<AxisAlignedBB> list, Entity collidingEntity)` — Add all collision boxes of this Block to the list that intersect with the given mask.
- `void applyHeadBounds(IBlockState state)`
- `void breakBlock(World worldIn, BlockPos pos, IBlockState state)`
- `boolean canPlaceBlockAt(World worldIn, BlockPos pos)`
- `boolean canPlaceBlockOnSide(World worldIn, BlockPos pos, EnumFacing side)` — Check whether this Block can be placed on the given side
- `protected BlockState createBlockState()`
- `static EnumFacing getFacing(int meta)`
- `Item getItem(World worldIn, BlockPos pos)`
- `int getMetaFromState(IBlockState state)` — Convert the BlockState into the correct metadata value
- `IBlockState getStateFromMeta(int meta)` — Convert the given metadata into a BlockState for this Block
- `boolean isFullCube()`
- `boolean isOpaqueCube()` — Used to determine ambient occlusion and culling when rebuilding chunks for render
- `void onBlockHarvested(World worldIn, BlockPos pos, IBlockState state, EntityPlayer player)`
- `void onNeighborBlockChange(World worldIn, BlockPos pos, IBlockState state, Block neighborBlock)` — Called when a neighboring block changes.
- `int quantityDropped(java.util.Random random)` — Returns the quantity of items to drop on block destruction.
- `void setBlockBoundsBasedOnState(IBlockAccess worldIn, BlockPos pos)`
- `boolean shouldSideBeRendered(IBlockAccess worldIn, BlockPos pos, EnumFacing side)`

## Fields

- `static PropertyDirection FACING`
- `static PropertyBool SHORT`
- `static PropertyEnum<BlockPistonExtension.EnumPistonType> TYPE`
