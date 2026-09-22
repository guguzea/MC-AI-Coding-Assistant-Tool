---
title: "BlockQuartz"
description: "public class BlockQuartz extends Block"
package: "net/minecraft/block"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/block/BlockQuartz.html"
sourceType: javadoc
---

# BlockQuartz

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraft.block.BlockQuartz

## Class signature

```java
public class BlockQuartz extends Block
```

## Constructors

- `BlockQuartz()`

## Methods

- `protected BlockStateContainer createBlockState()`
- `int damageDropped(IBlockState state)`
- `MapColor getMapColor(IBlockState state)`
- `int getMetaFromState(IBlockState state)`
- `protected ItemStack getSilkTouchDrop(IBlockState state)`
- `IBlockState getStateForPlacement(World worldIn, BlockPos pos, EnumFacing facing, float hitX, float hitY, float hitZ, int meta, EntityLivingBase placer)`
- `IBlockState getStateFromMeta(int meta)`
- `void getSubBlocks(Item itemIn, CreativeTabs tab, NonNullList<ItemStack> list)`
- `boolean rotateBlock(World world, BlockPos pos, EnumFacing axis)` — Rotate the block.
- `IBlockState withRotation(IBlockState state, Rotation rot)`

## Fields

- `static PropertyEnum<BlockQuartz.EnumType> VARIANT`
