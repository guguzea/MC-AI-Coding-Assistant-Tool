---
title: "BlockRotatedPillar"
description: "public class BlockRotatedPillar extends Block"
package: "net/minecraft/block"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/block/BlockRotatedPillar.html"
sourceType: javadoc
---

# BlockRotatedPillar

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraft.block.BlockRotatedPillar

## Class signature

```java
public class BlockRotatedPillar extends Block
```

## Constructors

- `BlockRotatedPillar(Material materialIn)`
- `BlockRotatedPillar(Material materialIn, MapColor color)`

## Methods

- `protected BlockStateContainer createBlockState()`
- `int getMetaFromState(IBlockState state)`
- `protected ItemStack getSilkTouchDrop(IBlockState state)`
- `IBlockState getStateForPlacement(World worldIn, BlockPos pos, EnumFacing facing, float hitX, float hitY, float hitZ, int meta, EntityLivingBase placer)`
- `IBlockState getStateFromMeta(int meta)`
- `boolean rotateBlock(World world, BlockPos pos, EnumFacing axis)` — Rotate the block.
- `IBlockState withRotation(IBlockState state, Rotation rot)`

## Fields

- `static PropertyEnum<EnumFacing.Axis> AXIS`
