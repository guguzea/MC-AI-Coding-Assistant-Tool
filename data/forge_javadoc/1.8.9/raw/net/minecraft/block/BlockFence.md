---
title: "BlockFence"
description: "public class BlockFence extends Block"
package: "net/minecraft/block"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/block/BlockFence.html"
sourceType: javadoc
---

# BlockFence

**Inheritance:** java.lang.Object → net.minecraft.block.Block → net.minecraft.block.BlockFence

## Class signature

```java
public class BlockFence extends Block
```

## Constructors

- `BlockFence(Material materialIn)`
- `BlockFence(Material p_i46395_1_, MapColor p_i46395_2_)`

## Methods

- `void addCollisionBoxesToList(World worldIn, BlockPos pos, IBlockState state, AxisAlignedBB mask, java.util.List<AxisAlignedBB> list, Entity collidingEntity)` — Add all collision boxes of this Block to the list that intersect with the given mask.
- `boolean canConnectTo(IBlockAccess worldIn, BlockPos pos)`
- `protected BlockState createBlockState()`
- `IBlockState getActualState(IBlockState state, IBlockAccess worldIn, BlockPos pos)` — Get the actual Block state of this Block at the given position.
- `int getMetaFromState(IBlockState state)` — Convert the BlockState into the correct metadata value
- `boolean isFullCube()`
- `boolean isOpaqueCube()` — Used to determine ambient occlusion and culling when rebuilding chunks for render
- `boolean isPassable(IBlockAccess worldIn, BlockPos pos)`
- `boolean onBlockActivated(World worldIn, BlockPos pos, IBlockState state, EntityPlayer playerIn, EnumFacing side, float hitX, float hitY, float hitZ)`
- `void setBlockBoundsBasedOnState(IBlockAccess worldIn, BlockPos pos)`
- `boolean shouldSideBeRendered(IBlockAccess worldIn, BlockPos pos, EnumFacing side)`

## Fields

- `static PropertyBool EAST` — Whether this fence connects in the eastern direction
- `static PropertyBool NORTH` — Whether this fence connects in the northern direction
- `static PropertyBool SOUTH` — Whether this fence connects in the southern direction
- `static PropertyBool WEST` — Whether this fence connects in the western direction
