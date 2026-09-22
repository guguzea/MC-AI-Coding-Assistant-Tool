---
title: "BlockVine"
description: "public class BlockVine extends Block implements IShearable"
package: "net/minecraft/block"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/block/BlockVine.html"
sourceType: javadoc
---

# BlockVine

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraft.block.BlockVine

## Class signature

```java
public class BlockVine extends Block implements IShearable
```

## Constructors

- `BlockVine()`

## Methods

- `boolean canPlaceBlockOnSide(World worldIn, BlockPos pos, EnumFacing side)`
- `protected BlockStateContainer createBlockState()`
- `IBlockState getActualState(IBlockState state, IBlockAccess worldIn, BlockPos pos)`
- `BlockRenderLayer getBlockLayer()`
- `AxisAlignedBB getBoundingBox(IBlockState state, IBlockAccess source, BlockPos pos)`
- `AxisAlignedBB getCollisionBoundingBox(IBlockState blockState, World worldIn, BlockPos pos)`
- `Item getItemDropped(IBlockState state, java.util.Random rand, int fortune)`
- `int getMetaFromState(IBlockState state)`
- `static int getNumGrownFaces(IBlockState state)`
- `static PropertyBool getPropertyFor(EnumFacing side)`
- `IBlockState getStateFromMeta(int meta)`
- `void harvestBlock(World worldIn, EntityPlayer player, BlockPos pos, IBlockState state, TileEntity te, ItemStack stack)`
- `boolean isFullCube(IBlockState state)`
- `boolean isLadder(IBlockState state, IBlockAccess world, BlockPos pos, EntityLivingBase entity)` — FORGE START
- `boolean isOpaqueCube(IBlockState state)`
- `boolean isReplaceable(IBlockAccess worldIn, BlockPos pos)`
- `boolean isShearable(ItemStack item, IBlockAccess world, BlockPos pos)` — Checks if the object is currently shearable Example: Sheep return false when they have no wool
- `void neighborChanged(IBlockState state, World worldIn, BlockPos pos, Block blockIn)`
- `IBlockState onBlockPlaced(World worldIn, BlockPos pos, EnumFacing facing, float hitX, float hitY, float hitZ, int meta, EntityLivingBase placer)`
- `java.util.List<ItemStack> onSheared(ItemStack item, IBlockAccess world, BlockPos pos, int fortune)` — Performs the shear function on this object.
- `int quantityDropped(java.util.Random random)`
- `void updateTick(World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `IBlockState withMirror(IBlockState state, Mirror mirrorIn)`
- `IBlockState withRotation(IBlockState state, Rotation rot)`

## Fields

- `static PropertyBool [] ALL_FACES`
- `static PropertyBool EAST`
- `protected static AxisAlignedBB EAST_AABB`
- `static PropertyBool NORTH`
- `protected static AxisAlignedBB NORTH_AABB`
- `static PropertyBool SOUTH`
- `protected static AxisAlignedBB SOUTH_AABB`
- `static PropertyBool UP`
- `protected static AxisAlignedBB UP_AABB`
- `static PropertyBool WEST`
- `protected static AxisAlignedBB WEST_AABB`
