---
title: "BlockVine"
description: "public class BlockVine extends Block implements IShearable"
package: "net/minecraft/block"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/block/BlockVine.html"
sourceType: javadoc
---

# BlockVine

**Inheritance:** java.lang.Object → net.minecraft.block.Block → net.minecraft.block.BlockVine

## Class signature

```java
public class BlockVine extends Block implements IShearable
```

## Constructors

- `BlockVine()`

## Methods

- `boolean canPlaceBlockOnSide(World worldIn, BlockPos pos, EnumFacing side)` — Check whether this Block can be placed on the given side
- `int colorMultiplier(IBlockAccess worldIn, BlockPos pos, int renderPass)`
- `protected BlockState createBlockState()`
- `IBlockState getActualState(IBlockState state, IBlockAccess worldIn, BlockPos pos)` — Get the actual Block state of this Block at the given position.
- `int getBlockColor()`
- `EnumWorldBlockLayer getBlockLayer()`
- `AxisAlignedBB getCollisionBoundingBox(World worldIn, BlockPos pos, IBlockState state)`
- `Item getItemDropped(IBlockState state, java.util.Random rand, int fortune)` — Get the Item that this Block should drop when harvested.
- `int getMetaFromState(IBlockState state)` — Convert the BlockState into the correct metadata value
- `static int getNumGrownFaces(IBlockState state)`
- `static PropertyBool getPropertyFor(EnumFacing side)`
- `int getRenderColor(IBlockState state)`
- `IBlockState getStateFromMeta(int meta)` — Convert the given metadata into a BlockState for this Block
- `void harvestBlock(World worldIn, EntityPlayer player, BlockPos pos, IBlockState state, TileEntity te)`
- `boolean isFullCube()`
- `boolean isLadder(IBlockAccess world, BlockPos pos, EntityLivingBase entity)` — FORGE START
- `boolean isOpaqueCube()` — Used to determine ambient occlusion and culling when rebuilding chunks for render
- `boolean isReplaceable(World worldIn, BlockPos pos)` — Whether this Block can be replaced directly by other blocks (true for e.g. tall grass)
- `boolean isShearable(ItemStack item, IBlockAccess world, BlockPos pos)` — Checks if the object is currently shearable Example: Sheep return false when they have no wool
- `IBlockState onBlockPlaced(World worldIn, BlockPos pos, EnumFacing facing, float hitX, float hitY, float hitZ, int meta, EntityLivingBase placer)` — Called by ItemBlocks just before a block is actually set in the world, to allow for adjustments to the IBlockstate
- `void onNeighborBlockChange(World worldIn, BlockPos pos, IBlockState state, Block neighborBlock)` — Called when a neighboring block changes.
- `java.util.List<ItemStack> onSheared(ItemStack item, IBlockAccess world, BlockPos pos, int fortune)` — Performs the shear function on this object.
- `int quantityDropped(java.util.Random random)` — Returns the quantity of items to drop on block destruction.
- `void setBlockBoundsBasedOnState(IBlockAccess worldIn, BlockPos pos)`
- `void setBlockBoundsForItemRender()` — Sets the block's bounds for rendering it as an item
- `void updateTick(World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`

## Fields

- `static PropertyBool [] ALL_FACES`
- `static PropertyBool EAST`
- `static PropertyBool NORTH`
- `static PropertyBool SOUTH`
- `static PropertyBool UP`
- `static PropertyBool WEST`
