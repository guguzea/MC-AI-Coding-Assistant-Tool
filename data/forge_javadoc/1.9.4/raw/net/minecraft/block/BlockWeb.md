---
title: "BlockWeb"
description: "public class BlockWeb extends Block"
package: "net/minecraft/block"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/block/BlockWeb.html"
sourceType: javadoc
---

# BlockWeb

## Class signature

```java
public class BlockWeb extends Block
```

## Constructors

- `public BlockWeb()`

## Methods

- `public void onEntityCollidedWithBlock( World worldIn, BlockPos pos, IBlockState state, Entity entityIn)`
- `public boolean isOpaqueCube( IBlockState state)`
- `@Nullable public AxisAlignedBB getCollisionBoundingBox( IBlockState blockState, World worldIn, BlockPos pos)`
- `public boolean isFullCube( IBlockState state)`
- `@Nullable public Item getItemDropped( IBlockState state, java.util.Random rand, int fortune)`
- `protected boolean canSilkHarvest()`
- `public BlockRenderLayer getBlockLayer()`
- `public void harvestBlock( World worldIn, EntityPlayer player, BlockPos pos, IBlockState state, @Nullable TileEntity te, @Nullable ItemStack stack)`
