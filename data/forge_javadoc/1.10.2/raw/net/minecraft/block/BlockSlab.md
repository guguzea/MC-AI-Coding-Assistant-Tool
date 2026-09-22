---
title: "BlockSlab"
description: "public abstract class BlockSlab extends Block"
package: "net/minecraft/block"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/block/BlockSlab.html"
sourceType: javadoc
---

# BlockSlab

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraft.block.BlockSlab

## Class signature

```java
public abstract class BlockSlab extends Block
```

## Constructors

- `BlockSlab(Material materialIn)`

## Methods

- `protected boolean canSilkHarvest()`
- `boolean doesSideBlockRendering(IBlockState state, IBlockAccess world, BlockPos pos, EnumFacing face)` — Check if the face of a block should block rendering.
- `AxisAlignedBB getBoundingBox(IBlockState state, IBlockAccess source, BlockPos pos)`
- `abstract java.lang.Comparable<?> getTypeForItem(ItemStack stack)`
- `abstract java.lang.String getUnlocalizedName(int meta)`
- `abstract IProperty<?> getVariantProperty()`
- `abstract boolean isDouble()`
- `boolean isFullCube(IBlockState state)`
- `boolean isFullyOpaque(IBlockState state)`
- `protected static boolean isHalfSlab(IBlockState state)`
- `boolean isOpaqueCube(IBlockState state)`
- `IBlockState onBlockPlaced(World worldIn, BlockPos pos, EnumFacing facing, float hitX, float hitY, float hitZ, int meta, EntityLivingBase placer)`
- `int quantityDropped(java.util.Random random)`
- `boolean shouldSideBeRendered(IBlockState blockState, IBlockAccess blockAccess, BlockPos pos, EnumFacing side)`

## Fields

- `protected static AxisAlignedBB AABB_BOTTOM_HALF`
- `protected static AxisAlignedBB AABB_TOP_HALF`
- `static PropertyEnum<BlockSlab.EnumBlockHalf> HALF`
