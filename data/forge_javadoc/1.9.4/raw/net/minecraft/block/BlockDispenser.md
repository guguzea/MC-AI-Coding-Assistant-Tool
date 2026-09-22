---
title: "BlockDispenser"
description: "public class BlockDispenser extends BlockContainer"
package: "net/minecraft/block"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/block/BlockDispenser.html"
sourceType: javadoc
---

# BlockDispenser

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraft.block.BlockContainer → net.minecraft.block.BlockDispenser

## Class signature

```java
public class BlockDispenser extends BlockContainer
```

## Constructors

- `BlockDispenser()`

## Methods

- `void breakBlock(World worldIn, BlockPos pos, IBlockState state)`
- `protected BlockStateContainer createBlockState()`
- `TileEntity createNewTileEntity(World worldIn, int meta)`
- `protected void dispense(World worldIn, BlockPos pos)`
- `protected IBehaviorDispenseItem getBehavior(ItemStack stack)`
- `int getComparatorInputOverride(IBlockState blockState, World worldIn, BlockPos pos)`
- `static IPosition getDispensePosition(IBlockSource coords)`
- `static EnumFacing getFacing(int meta)`
- `int getMetaFromState(IBlockState state)`
- `EnumBlockRenderType getRenderType(IBlockState state)`
- `IBlockState getStateFromMeta(int meta)`
- `boolean hasComparatorInputOverride(IBlockState state)`
- `void neighborChanged(IBlockState state, World worldIn, BlockPos pos, Block blockIn)`
- `boolean onBlockActivated(World worldIn, BlockPos pos, IBlockState state, EntityPlayer playerIn, EnumHand hand, ItemStack heldItem, EnumFacing side, float hitX, float hitY, float hitZ)`
- `void onBlockAdded(World worldIn, BlockPos pos, IBlockState state)`
- `IBlockState onBlockPlaced(World worldIn, BlockPos pos, EnumFacing facing, float hitX, float hitY, float hitZ, int meta, EntityLivingBase placer)`
- `void onBlockPlacedBy(World worldIn, BlockPos pos, IBlockState state, EntityLivingBase placer, ItemStack stack)`
- `int tickRate(World worldIn)`
- `void updateTick(World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `IBlockState withMirror(IBlockState state, Mirror mirrorIn)`
- `IBlockState withRotation(IBlockState state, Rotation rot)`

## Fields

- `static RegistryDefaulted<Item, IBehaviorDispenseItem> DISPENSE_BEHAVIOR_REGISTRY`
- `static PropertyDirection FACING`
- `protected java.util.Random rand`
- `static PropertyBool TRIGGERED`
