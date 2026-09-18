---
title: "BlockWeb"
description: "public class BlockWeb extends Block"
package: "net/minecraft/block"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/block/BlockWeb.html"
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
- `@Nullable public AxisAlignedBB getCollisionBoundingBox( IBlockState blockState, IBlockAccess worldIn, BlockPos pos)`
- `public boolean isFullCube( IBlockState state)`
- `public Item getItemDropped( IBlockState state, java.util.Random rand, int fortune)`
- `protected boolean canSilkHarvest()`
- `public BlockRenderLayer getBlockLayer()`
- `public void harvestBlock( World worldIn, EntityPlayer player, BlockPos pos, IBlockState state, @Nullable TileEntity te, ItemStack stack)`
