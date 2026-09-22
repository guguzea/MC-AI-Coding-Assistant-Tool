---
title: "BlockDirt"
description: "public class BlockDirt extends Block"
package: "net/minecraft/block"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/block/BlockDirt.html"
sourceType: javadoc
---

# BlockDirt

**Inheritance:** java.lang.Object → net.minecraft.block.Block → net.minecraft.block.BlockDirt

## Class signature

```java
public class BlockDirt extends Block
```

## Constructors

- `BlockDirt()`

## Methods

- `protected BlockState createBlockState()`
- `int damageDropped(IBlockState state)` — Gets the metadata of the item this Block can drop.
- `IBlockState getActualState(IBlockState state, IBlockAccess worldIn, BlockPos pos)` — Get the actual Block state of this Block at the given position.
- `int getDamageValue(World worldIn, BlockPos pos)`
- `MapColor getMapColor(IBlockState state)` — Get the MapColor for this Block and the given BlockState
- `int getMetaFromState(IBlockState state)` — Convert the BlockState into the correct metadata value
- `IBlockState getStateFromMeta(int meta)` — Convert the given metadata into a BlockState for this Block
- `void getSubBlocks(Item itemIn, CreativeTabs tab, java.util.List<ItemStack> list)` — returns a list of blocks with the same ID, but different meta (eg: wood returns 4 blocks)

## Fields

- `static PropertyBool SNOWY`
- `static PropertyEnum<BlockDirt.DirtType> VARIANT`
