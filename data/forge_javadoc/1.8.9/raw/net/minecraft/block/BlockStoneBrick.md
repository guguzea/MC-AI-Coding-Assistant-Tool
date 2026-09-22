---
title: "BlockStoneBrick"
description: "public class BlockStoneBrick extends Block"
package: "net/minecraft/block"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/block/BlockStoneBrick.html"
sourceType: javadoc
---

# BlockStoneBrick

**Inheritance:** java.lang.Object → net.minecraft.block.Block → net.minecraft.block.BlockStoneBrick

## Class signature

```java
public class BlockStoneBrick extends Block
```

## Constructors

- `BlockStoneBrick()`

## Methods

- `protected BlockState createBlockState()`
- `int damageDropped(IBlockState state)` — Gets the metadata of the item this Block can drop.
- `int getMetaFromState(IBlockState state)` — Convert the BlockState into the correct metadata value
- `IBlockState getStateFromMeta(int meta)` — Convert the given metadata into a BlockState for this Block
- `void getSubBlocks(Item itemIn, CreativeTabs tab, java.util.List<ItemStack> list)` — returns a list of blocks with the same ID, but different meta (eg: wood returns 4 blocks)

## Fields

- `static int CHISELED_META`
- `static int CRACKED_META`
- `static int DEFAULT_META`
- `static int MOSSY_META`
- `static PropertyEnum<BlockStoneBrick.EnumType> VARIANT`
