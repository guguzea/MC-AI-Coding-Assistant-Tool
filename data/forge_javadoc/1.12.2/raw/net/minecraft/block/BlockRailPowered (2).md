---
title: "BlockRailPowered"
description: "public class BlockRailPowered extends BlockRailBase"
package: "net/minecraft/block"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/block/BlockRailPowered.html"
sourceType: javadoc
---

# BlockRailPowered

## Class signature

```java
public class BlockRailPowered extends BlockRailBase
```

## Constructors

- `protected BlockRailPowered()`
- `protected BlockRailPowered(boolean isActivator)`

## Methods

- `protected boolean findPoweredRailSignal( World worldIn, BlockPos pos, IBlockState state, boolean p_176566_4_, int p_176566_5_)`
- `protected boolean isSameRailWithPower( World worldIn, BlockPos pos, boolean p_176567_3_, int distance, BlockRailBase.EnumRailDirection p_176567_5_)`
- `protected void updateState( IBlockState state, World worldIn, BlockPos pos, Block blockIn)`
- `public IProperty < BlockRailBase.EnumRailDirection > getShapeProperty()`
- `public IBlockState getStateFromMeta(int meta)`
- `public int getMetaFromState( IBlockState state)`
- `public IBlockState withRotation( IBlockState state, Rotation rot)`
- `public IBlockState withMirror( IBlockState state, Mirror mirrorIn)`
- `protected BlockStateContainer createBlockState()`
