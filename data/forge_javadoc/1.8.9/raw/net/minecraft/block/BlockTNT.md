---
title: "BlockTNT"
description: "public class BlockTNT extends Block"
package: "net/minecraft/block"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/block/BlockTNT.html"
sourceType: javadoc
---

# BlockTNT

**Inheritance:** java.lang.Object → net.minecraft.block.Block → net.minecraft.block.BlockTNT

## Class signature

```java
public class BlockTNT extends Block
```

## Constructors

- `BlockTNT()`

## Methods

- `boolean canDropFromExplosion(Explosion explosionIn)` — Return whether this block can drop from an explosion.
- `protected BlockState createBlockState()`
- `void explode(World worldIn, BlockPos pos, IBlockState state, EntityLivingBase igniter)`
- `int getMetaFromState(IBlockState state)` — Convert the BlockState into the correct metadata value
- `IBlockState getStateFromMeta(int meta)` — Convert the given metadata into a BlockState for this Block
- `boolean onBlockActivated(World worldIn, BlockPos pos, IBlockState state, EntityPlayer playerIn, EnumFacing side, float hitX, float hitY, float hitZ)`
- `void onBlockAdded(World worldIn, BlockPos pos, IBlockState state)`
- `void onBlockDestroyedByExplosion(World worldIn, BlockPos pos, Explosion explosionIn)` — Called when this Block is destroyed by an Explosion
- `void onBlockDestroyedByPlayer(World worldIn, BlockPos pos, IBlockState state)` — Called when a player destroys this Block
- `void onEntityCollidedWithBlock(World worldIn, BlockPos pos, IBlockState state, Entity entityIn)` — Called When an Entity Collided with the Block
- `void onNeighborBlockChange(World worldIn, BlockPos pos, IBlockState state, Block neighborBlock)` — Called when a neighboring block changes.

## Fields

- `static PropertyBool EXPLODE`
