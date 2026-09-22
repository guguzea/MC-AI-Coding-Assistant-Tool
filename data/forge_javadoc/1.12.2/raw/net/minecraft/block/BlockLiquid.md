---
title: "BlockLiquid"
description: "public abstract class BlockLiquid extends Block"
package: "net/minecraft/block"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/block/BlockLiquid.html"
sourceType: javadoc
---

# BlockLiquid

**Inheritance:** java.lang.Object → net.minecraftforge.registries.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraft.block.BlockLiquid

## Class signature

```java
public abstract class BlockLiquid extends Block
```

## Constructors

- `BlockLiquid(Material materialIn)`

## Methods

- `boolean canCollideCheck(IBlockState state, boolean hitIfLiquid)`
- `boolean checkForMixing(World worldIn, BlockPos pos, IBlockState state)`
- `protected BlockStateContainer createBlockState()`
- `BlockFaceShape getBlockFaceShape(IBlockAccess worldIn, IBlockState state, BlockPos pos, EnumFacing face)`
- `BlockRenderLayer getBlockLayer()`
- `static float getBlockLiquidHeight(IBlockState state, IBlockAccess worldIn, BlockPos pos)`
- `float getBlockLiquidHeight(World world, BlockPos pos, IBlockState state, Material material)` — Called when entities are swimming in the given liquid and returns the relative height (used by EntityBoat )
- `AxisAlignedBB getBoundingBox(IBlockState state, IBlockAccess source, BlockPos pos)`
- `AxisAlignedBB getCollisionBoundingBox(IBlockState blockState, IBlockAccess worldIn, BlockPos pos)`
- `protected int getDepth(IBlockState state)`
- `protected Vec3d getFlow(IBlockAccess worldIn, BlockPos pos, IBlockState state)`
- `static BlockDynamicLiquid getFlowingBlock(Material materialIn)`
- `Vec3d getFogColor(World world, BlockPos pos, IBlockState state, Entity entity, Vec3d originalColor, float partialTicks)` — Use this to change the fog color used when the entity is "inside" a material.
- `Item getItemDropped(IBlockState state, java.util.Random rand, int fortune)`
- `static float getLiquidHeight(IBlockState state, IBlockAccess worldIn, BlockPos pos)`
- `static float getLiquidHeightPercent(int meta)`
- `int getMetaFromState(IBlockState state)`
- `int getPackedLightmapCoords(IBlockState state, IBlockAccess source, BlockPos pos)`
- `protected int getRenderedDepth(IBlockState state)`
- `EnumBlockRenderType getRenderType(IBlockState state)`
- `static float getSlopeAngle(IBlockAccess worldIn, BlockPos pos, Material materialIn, IBlockState state)`
- `IBlockState getStateFromMeta(int meta)`
- `static BlockStaticLiquid getStaticBlock(Material materialIn)`
- `boolean isFullCube(IBlockState state)`
- `boolean isOpaqueCube(IBlockState state)`
- `boolean isPassable(IBlockAccess worldIn, BlockPos pos)`
- `Vec3d modifyAcceleration(World worldIn, BlockPos pos, Entity entityIn, Vec3d motion)`
- `void neighborChanged(IBlockState state, World worldIn, BlockPos pos, Block blockIn, BlockPos fromPos)`
- `void onBlockAdded(World worldIn, BlockPos pos, IBlockState state)`
- `int quantityDropped(java.util.Random random)`
- `void randomDisplayTick(IBlockState stateIn, World worldIn, BlockPos pos, java.util.Random rand)`
- `boolean shouldRenderSides(IBlockAccess blockAccess, BlockPos pos)`
- `boolean shouldSideBeRendered(IBlockState blockState, IBlockAccess blockAccess, BlockPos pos, EnumFacing side)`
- `int tickRate(World worldIn)`
- `protected void triggerMixEffects(World worldIn, BlockPos pos)`

## Fields

- `static PropertyInteger LEVEL`
