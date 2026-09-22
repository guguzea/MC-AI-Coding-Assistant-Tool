---
title: "BlockBeacon"
description: "public class BlockBeacon extends BlockContainer"
package: "net/minecraft/block"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/block/BlockBeacon.html"
sourceType: javadoc
---

# BlockBeacon

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraft.block.BlockContainer → net.minecraft.block.BlockBeacon

## Class signature

```java
public class BlockBeacon extends BlockContainer
```

## Methods

- `TileEntity createNewTileEntity(World worldIn, int meta)`
- `BlockRenderLayer getBlockLayer()`
- `EnumBlockRenderType getRenderType(IBlockState state)`
- `boolean isFullCube(IBlockState state)`
- `boolean isOpaqueCube(IBlockState state)`
- `void neighborChanged(IBlockState state, World worldIn, BlockPos pos, Block blockIn)`
- `boolean onBlockActivated(World worldIn, BlockPos pos, IBlockState state, EntityPlayer playerIn, EnumHand hand, ItemStack heldItem, EnumFacing side, float hitX, float hitY, float hitZ)`
- `void onBlockPlacedBy(World worldIn, BlockPos pos, IBlockState state, EntityLivingBase placer, ItemStack stack)`
- `static void updateColorAsync(World worldIn, BlockPos glassPos)`

## Fields

- `BlockBeacon`
