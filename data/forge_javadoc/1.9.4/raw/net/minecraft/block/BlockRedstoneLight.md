---
title: "BlockRedstoneLight"
description: "public class BlockRedstoneLight extends Block"
package: "net/minecraft/block"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/block/BlockRedstoneLight.html"
sourceType: javadoc
---

# BlockRedstoneLight

## Class signature

```java
public class BlockRedstoneLight extends Block
```

## Constructors

- `public BlockRedstoneLight(boolean isOn)`

## Methods

- `public void onBlockAdded( World worldIn, BlockPos pos, IBlockState state)`
- `public void neighborChanged( IBlockState state, World worldIn, BlockPos pos, Block blockIn)`
- `public void updateTick( World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `@Nullable public Item getItemDropped( IBlockState state, java.util.Random rand, int fortune)`
- `public ItemStack getItem( World worldIn, BlockPos pos, IBlockState state)`
- `protected ItemStack createStackedBlock( IBlockState state)`
