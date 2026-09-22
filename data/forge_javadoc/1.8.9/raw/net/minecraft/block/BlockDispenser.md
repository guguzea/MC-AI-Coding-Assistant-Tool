---
title: "BlockDispenser"
description: "public class BlockDispenser extends BlockContainer"
package: "net/minecraft/block"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/block/BlockDispenser.html"
sourceType: javadoc
---

# BlockDispenser

**Inheritance:** java.lang.Object → net.minecraft.block.Block → net.minecraft.block.BlockContainer → net.minecraft.block.BlockDispenser

## Class signature

```java
public class BlockDispenser extends BlockContainer
```

## Constructors

- `BlockDispenser()`

## Methods

- `void breakBlock(World worldIn, BlockPos pos, IBlockState state)`
- `protected BlockState createBlockState()`
- `TileEntity createNewTileEntity(World worldIn, int meta)` — Returns a new instance of a block's tile entity class.
- `protected void dispense(World worldIn, BlockPos pos)`
- `protected IBehaviorDispenseItem getBehavior(ItemStack stack)`
- `int getComparatorInputOverride(World worldIn, BlockPos pos)`
- `static IPosition getDispensePosition(IBlockSource coords)` — Get the position where the dispenser at the given Coordinates should dispense to.
- `static EnumFacing getFacing(int meta)` — Get the facing of a dispenser with the given metadata
- `int getMetaFromState(IBlockState state)` — Convert the BlockState into the correct metadata value
- `int getRenderType()` — The type of render function called. 3 for standard block models, 2 for TESR's, 1 for liquids, -1 is no render
- `IBlockState getStateForEntityRender(IBlockState state)` — Possibly modify the given BlockState before rendering it on an Entity (Minecarts, Endermen, ...)
- `IBlockState getStateFromMeta(int meta)` — Convert the given metadata into a BlockState for this Block
- `boolean hasComparatorInputOverride()`
- `boolean onBlockActivated(World worldIn, BlockPos pos, IBlockState state, EntityPlayer playerIn, EnumFacing side, float hitX, float hitY, float hitZ)`
- `void onBlockAdded(World worldIn, BlockPos pos, IBlockState state)`
- `IBlockState onBlockPlaced(World worldIn, BlockPos pos, EnumFacing facing, float hitX, float hitY, float hitZ, int meta, EntityLivingBase placer)` — Called by ItemBlocks just before a block is actually set in the world, to allow for adjustments to the IBlockstate
- `void onBlockPlacedBy(World worldIn, BlockPos pos, IBlockState state, EntityLivingBase placer, ItemStack stack)` — Called by ItemBlocks after a block is set in the world, to allow post-place logic
- `void onNeighborBlockChange(World worldIn, BlockPos pos, IBlockState state, Block neighborBlock)` — Called when a neighboring block changes.
- `int tickRate(World worldIn)` — How many world ticks before ticking
- `void updateTick(World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`

## Fields

- `static RegistryDefaulted<Item, IBehaviorDispenseItem> dispenseBehaviorRegistry`
- `static PropertyDirection FACING`
- `protected java.util.Random rand`
- `static PropertyBool TRIGGERED`
