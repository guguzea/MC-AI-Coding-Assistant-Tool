---
title: "BlockNote"
description: "Returns a new instance of a block's tile entity class."
package: "net/minecraft/block"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/block/BlockNote.html"
sourceType: javadoc
---

# BlockNote

## Class signature

```java
public class BlockNote extends BlockContainer
```

## Constructors

- `public BlockNote()`

## Methods

- `public void onNeighborBlockChange( World worldIn, BlockPos pos, IBlockState state, Block neighborBlock)`
- `public boolean onBlockActivated( World worldIn, BlockPos pos, IBlockState state, EntityPlayer playerIn, EnumFacing side, float hitX, float hitY, float hitZ)`
- `public void onBlockClicked( World worldIn, BlockPos pos, EntityPlayer playerIn)`
- `public TileEntity createNewTileEntity( World worldIn, int meta)`
- `public boolean onBlockEventReceived( World worldIn, BlockPos pos, IBlockState state, int eventID, int eventParam)`
- `public int getRenderType()`

## Description

Returns a new instance of a block's tile entity class.
