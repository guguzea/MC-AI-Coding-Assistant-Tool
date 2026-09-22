---
title: "BlockEnchantmentTable"
description: "public class BlockEnchantmentTable extends BlockContainer"
package: "net/minecraft/block"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/block/BlockEnchantmentTable.html"
sourceType: javadoc
---

# BlockEnchantmentTable

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraft.block.BlockContainer → net.minecraft.block.BlockEnchantmentTable

## Class signature

```java
public class BlockEnchantmentTable extends BlockContainer
```

## Constructors

- `BlockEnchantmentTable()`

## Methods

- `TileEntity createNewTileEntity(World worldIn, int meta)`
- `AxisAlignedBB getBoundingBox(IBlockState state, IBlockAccess source, BlockPos pos)`
- `EnumBlockRenderType getRenderType(IBlockState state)`
- `boolean isFullCube(IBlockState state)`
- `boolean isOpaqueCube(IBlockState state)`
- `boolean onBlockActivated(World worldIn, BlockPos pos, IBlockState state, EntityPlayer playerIn, EnumHand hand, ItemStack heldItem, EnumFacing side, float hitX, float hitY, float hitZ)`
- `void onBlockPlacedBy(World worldIn, BlockPos pos, IBlockState state, EntityLivingBase placer, ItemStack stack)`
- `void randomDisplayTick(IBlockState stateIn, World worldIn, BlockPos pos, java.util.Random rand)`

## Fields

- `protected static AxisAlignedBB AABB`
