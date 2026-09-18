---
title: "BlockSponge"
description: "public class BlockSponge extends Block"
package: "net/minecraft/block"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/block/BlockSponge.html"
sourceType: javadoc
---

# BlockSponge

## Class signature

```java
public class BlockSponge extends Block
```

## Constructors

- `protected BlockSponge()`

## Methods

- `public java.lang.String getLocalizedName()`
- `public int damageDropped( IBlockState state)`
- `public void onBlockAdded( World worldIn, BlockPos pos, IBlockState state)`
- `public void neighborChanged( IBlockState state, World worldIn, BlockPos pos, Block blockIn)`
- `protected void tryAbsorb( World worldIn, BlockPos pos, IBlockState state)`
- `public void getSubBlocks( Item itemIn, CreativeTabs tab, java.util.List< ItemStack > list)`
- `public IBlockState getStateFromMeta(int meta)`
- `public int getMetaFromState( IBlockState state)`
- `protected BlockStateContainer createBlockState()`
- `public void randomDisplayTick( IBlockState stateIn, World worldIn, BlockPos pos, java.util.Random rand)`
