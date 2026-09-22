---
title: "BlockTripWire"
description: "public class BlockTripWire extends Block"
package: "net/minecraft/block"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/block/BlockTripWire.html"
sourceType: javadoc
---

# BlockTripWire

**Inheritance:** java.lang.Object → net.minecraft.block.Block → net.minecraft.block.BlockTripWire

## Class signature

```java
public class BlockTripWire extends Block
```

## Constructors

- `BlockTripWire()`

## Methods

- `void breakBlock(World worldIn, BlockPos pos, IBlockState state)`
- `protected BlockState createBlockState()`
- `IBlockState getActualState(IBlockState state, IBlockAccess worldIn, BlockPos pos)` — Get the actual Block state of this Block at the given position.
- `EnumWorldBlockLayer getBlockLayer()`
- `AxisAlignedBB getCollisionBoundingBox(World worldIn, BlockPos pos, IBlockState state)`
- `Item getItem(World worldIn, BlockPos pos)`
- `Item getItemDropped(IBlockState state, java.util.Random rand, int fortune)` — Get the Item that this Block should drop when harvested.
- `int getMetaFromState(IBlockState state)` — Convert the BlockState into the correct metadata value
- `IBlockState getStateFromMeta(int meta)` — Convert the given metadata into a BlockState for this Block
- `static boolean isConnectedTo(IBlockAccess worldIn, BlockPos pos, IBlockState state, EnumFacing direction)`
- `boolean isFullCube()`
- `boolean isOpaqueCube()` — Used to determine ambient occlusion and culling when rebuilding chunks for render
- `void onBlockAdded(World worldIn, BlockPos pos, IBlockState state)`
- `void onBlockHarvested(World worldIn, BlockPos pos, IBlockState state, EntityPlayer player)`
- `void onEntityCollidedWithBlock(World worldIn, BlockPos pos, IBlockState state, Entity entityIn)` — Called When an Entity Collided with the Block
- `void onNeighborBlockChange(World worldIn, BlockPos pos, IBlockState state, Block neighborBlock)` — Called when a neighboring block changes.
- `void randomTick(World worldIn, BlockPos pos, IBlockState state, java.util.Random random)` — Called randomly when setTickRandomly is set to true (used by e.g. crops to grow, etc.)
- `void setBlockBoundsBasedOnState(IBlockAccess worldIn, BlockPos pos)`
- `void updateTick(World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`

## Fields

- `static PropertyBool ATTACHED`
- `static PropertyBool DISARMED`
- `static PropertyBool EAST`
- `static PropertyBool NORTH`
- `static PropertyBool POWERED`
- `static PropertyBool SOUTH`
- `static PropertyBool SUSPENDED`
- `static PropertyBool WEST`
