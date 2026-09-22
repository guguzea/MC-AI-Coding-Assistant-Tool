---
title: "BlockNewLeaf"
description: "public class BlockNewLeaf extends BlockLeaves"
package: "net/minecraft/block"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/block/BlockNewLeaf.html"
sourceType: javadoc
---

# BlockNewLeaf

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraft.block.BlockLeaves → net.minecraft.block.BlockNewLeaf

## Class signature

```java
public class BlockNewLeaf extends BlockLeaves
```

## Constructors

- `BlockNewLeaf()`

## Methods

- `protected BlockStateContainer createBlockState()`
- `protected ItemStack createStackedBlock(IBlockState state)`
- `int damageDropped(IBlockState state)`
- `protected void dropApple(World worldIn, BlockPos pos, IBlockState state, int chance)`
- `ItemStack getItem(World worldIn, BlockPos pos, IBlockState state)`
- `int getMetaFromState(IBlockState state)`
- `IBlockState getStateFromMeta(int meta)`
- `void getSubBlocks(Item itemIn, CreativeTabs tab, java.util.List<ItemStack> list)`
- `BlockPlanks.EnumType getWoodType(int meta)`
- `void harvestBlock(World worldIn, EntityPlayer player, BlockPos pos, IBlockState state, TileEntity te, ItemStack stack)`
- `java.util.List<ItemStack> onSheared(ItemStack item, IBlockAccess world, BlockPos pos, int fortune)` — Performs the shear function on this object.

## Fields

- `static PropertyEnum<BlockPlanks.EnumType> VARIANT`
