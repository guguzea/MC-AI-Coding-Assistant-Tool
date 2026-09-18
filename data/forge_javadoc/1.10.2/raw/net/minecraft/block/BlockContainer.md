---
title: "BlockContainer"
description: "public abstract class BlockContainer extends Block implements ITileEntityProvider"
package: "net/minecraft/block"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/block/BlockContainer.html"
sourceType: javadoc
---

# BlockContainer

## Class signature

```java
public abstract class BlockContainer extends Block implements ITileEntityProvider
```

## Constructors

- `protected BlockContainer( Material materialIn)`
- `protected BlockContainer( Material materialIn, MapColor color)`

## Methods

- `protected boolean isInvalidNeighbor( World worldIn, BlockPos pos, EnumFacing facing)`
- `protected boolean hasInvalidNeighbor( World worldIn, BlockPos pos)`
- `public EnumBlockRenderType getRenderType( IBlockState state)`
- `public void breakBlock( World worldIn, BlockPos pos, IBlockState state)`
- `public boolean eventReceived( IBlockState state, World worldIn, BlockPos pos, int id, int param)`
