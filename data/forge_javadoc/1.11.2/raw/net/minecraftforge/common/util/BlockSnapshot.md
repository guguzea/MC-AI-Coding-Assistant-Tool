---
title: "BlockSnapshot"
description: "Represents a captured snapshot of a block which will not change automatically. Unlike Block, which only one object can exist per coordinate, BlockSnapshot can exist multiple times for any given Block."
package: "net/minecraftforge/common/util"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/common/util/BlockSnapshot.html"
sourceType: javadoc
---

# BlockSnapshot

## Class signature

```java
public class BlockSnapshot extends java.lang.Object implements java.io.Serializable
```

## Constructors

- `public BlockSnapshot( World world, BlockPos pos, IBlockState state)`
- `public BlockSnapshot( World world, BlockPos pos, IBlockState state, @Nullable NBTTagCompound nbt)`
- `public BlockSnapshot( World world, BlockPos pos, IBlockState state, int flag)`
- `public BlockSnapshot(int dimension, BlockPos pos, java.lang.String modId, java.lang.String blockName, int meta, int flag, @Nullable NBTTagCompound nbt)`

## Methods

- `public static BlockSnapshot getBlockSnapshot( World world, BlockPos pos)`
- `public static BlockSnapshot getBlockSnapshot( World world, BlockPos pos, int flag)`
- `public static BlockSnapshot readFromNBT( NBTTagCompound tag)`
- `public IBlockState getCurrentBlock()`
- `public World getWorld()`
- `public IBlockState getReplacedBlock()`
- `public TileEntity getTileEntity()`
- `public boolean restore()`
- `public boolean restore(boolean force)`
- `public boolean restore(boolean force, boolean applyPhysics)`
- `public boolean restoreToLocation( World world, BlockPos pos, boolean force, boolean applyPhysics)`
- `public void writeToNBT( NBTTagCompound compound)`
- `public boolean equals(java.lang.Object obj)`
- `public int hashCode()`
- `public BlockPos getPos()`
- `public int getDimId()`
- `public void setReplacedBlock( IBlockState replacedBlock)`
- `public int getFlag()`
- `public void setFlag(int flag)`
- `@Nullable public NBTTagCompound getNbt()`
- `public void setWorld( World world)`
- `public ResourceLocation getRegistryName()`
- `public int getMeta()`

## Description

Represents a captured snapshot of a block which will not change automatically. Unlike Block, which only one object can exist per coordinate, BlockSnapshot can exist multiple times for any given Block.
