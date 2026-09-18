---
title: "BlockJukebox"
description: "public class BlockJukebox extends BlockContainer"
package: "net/minecraft/block"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/block/BlockJukebox.html"
sourceType: javadoc
---

# BlockJukebox

## Class signature

```java
public class BlockJukebox extends BlockContainer
```

## Constructors

- `protected BlockJukebox()`

## Methods

- `public static void registerFixesJukebox( DataFixer fixer)`
- `public boolean onBlockActivated( World worldIn, BlockPos pos, IBlockState state, EntityPlayer playerIn, EnumHand hand, EnumFacing facing, float hitX, float hitY, float hitZ)`
- `public void insertRecord( World worldIn, BlockPos pos, IBlockState state, ItemStack recordStack)`
- `public void breakBlock( World worldIn, BlockPos pos, IBlockState state)`
- `public void dropBlockAsItemWithChance( World worldIn, BlockPos pos, IBlockState state, float chance, int fortune)`
- `public TileEntity createNewTileEntity( World worldIn, int meta)`
- `public boolean hasComparatorInputOverride( IBlockState state)`
- `public int getComparatorInputOverride( IBlockState blockState, World worldIn, BlockPos pos)`
- `public EnumBlockRenderType getRenderType( IBlockState state)`
- `public IBlockState getStateFromMeta(int meta)`
- `public int getMetaFromState( IBlockState state)`
- `protected BlockStateContainer createBlockState()`
