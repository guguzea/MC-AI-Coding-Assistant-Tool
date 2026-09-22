---
title: "BlockEnchantmentTable"
description: "public class BlockEnchantmentTable extends BlockContainer"
package: "net/minecraft/block"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/block/BlockEnchantmentTable.html"
sourceType: javadoc
---

# BlockEnchantmentTable

**Inheritance:** java.lang.Object → net.minecraft.block.Block → net.minecraft.block.BlockContainer → net.minecraft.block.BlockEnchantmentTable

## Class signature

```java
public class BlockEnchantmentTable extends BlockContainer
```

## Methods

- `TileEntity createNewTileEntity(World worldIn, int meta)` — Returns a new instance of a block's tile entity class.
- `int getRenderType()` — The type of render function called. 3 for standard block models, 2 for TESR's, 1 for liquids, -1 is no render
- `boolean isFullCube()`
- `boolean isOpaqueCube()` — Used to determine ambient occlusion and culling when rebuilding chunks for render
- `boolean onBlockActivated(World worldIn, BlockPos pos, IBlockState state, EntityPlayer playerIn, EnumFacing side, float hitX, float hitY, float hitZ)`
- `void onBlockPlacedBy(World worldIn, BlockPos pos, IBlockState state, EntityLivingBase placer, ItemStack stack)` — Called by ItemBlocks after a block is set in the world, to allow post-place logic
- `void randomDisplayTick(World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`

## Fields

- `protected BlockEnchantmentTable`
