---
title: "BlockContainer"
description: "public abstract class BlockContainer extends Block implements ITileEntityProvider"
package: "net/minecraft/block"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/block/BlockContainer.html"
sourceType: javadoc
---

# BlockContainer

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraft.block.BlockContainer

## Class signature

```java
public abstract class BlockContainer extends Block implements ITileEntityProvider
```

## Methods

- `void breakBlock(World worldIn, BlockPos pos, IBlockState state)`
- `boolean eventReceived(IBlockState state, World worldIn, BlockPos pos, int id, int param)`
- `EnumBlockRenderType getRenderType(IBlockState state)`
- `void harvestBlock(World worldIn, EntityPlayer player, BlockPos pos, IBlockState state, TileEntity te, ItemStack stack)`
- `protected boolean hasInvalidNeighbor(World worldIn, BlockPos pos)`
- `protected boolean isInvalidNeighbor(World worldIn, BlockPos pos, EnumFacing facing)`

## Fields

- `protected BlockContainer`
- `protected BlockContainer`
