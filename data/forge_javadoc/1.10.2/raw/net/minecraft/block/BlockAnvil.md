---
title: "BlockAnvil"
description: "public class BlockAnvil extends BlockFalling"
package: "net/minecraft/block"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/block/BlockAnvil.html"
sourceType: javadoc
---

# BlockAnvil

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraft.block.BlockFalling → net.minecraft.block.BlockAnvil

## Class signature

```java
public class BlockAnvil extends BlockFalling
```

## Constructors

- `BlockAnvil()`

## Methods

- `protected BlockStateContainer createBlockState()`
- `int damageDropped(IBlockState state)`
- `AxisAlignedBB getBoundingBox(IBlockState state, IBlockAccess source, BlockPos pos)`
- `int getMetaFromState(IBlockState state)`
- `IBlockState getStateFromMeta(int meta)`
- `void getSubBlocks(Item itemIn, CreativeTabs tab, java.util.List<ItemStack> list)`
- `boolean isFullCube(IBlockState state)`
- `boolean isOpaqueCube(IBlockState state)`
- `boolean onBlockActivated(World worldIn, BlockPos pos, IBlockState state, EntityPlayer playerIn, EnumHand hand, ItemStack heldItem, EnumFacing side, float hitX, float hitY, float hitZ)`
- `IBlockState onBlockPlaced(World worldIn, BlockPos pos, EnumFacing facing, float hitX, float hitY, float hitZ, int meta, EntityLivingBase placer)`
- `void onEndFalling(World worldIn, BlockPos pos)`
- `protected void onStartFalling(EntityFallingBlock fallingEntity)`
- `boolean shouldSideBeRendered(IBlockState blockState, IBlockAccess blockAccess, BlockPos pos, EnumFacing side)`
- `IBlockState withRotation(IBlockState state, Rotation rot)`

## Fields

- `static PropertyInteger DAMAGE`
- `static PropertyDirection FACING`
- `protected static org.apache.logging.log4j.Logger LOGGER`
- `protected static AxisAlignedBB X_AXIS_AABB`
- `protected static AxisAlignedBB Z_AXIS_AABB`
