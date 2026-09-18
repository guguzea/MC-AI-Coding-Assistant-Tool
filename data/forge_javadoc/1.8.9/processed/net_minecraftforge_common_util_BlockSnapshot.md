# BlockSnapshot

## Class signature

```java
public class BlockSnapshot extends java.lang.Object implements java.io.Serializable
```

## Constructors

- `public BlockSnapshot( World world, BlockPos pos, IBlockState state)`
- `public BlockSnapshot( World world, BlockPos pos, IBlockState state, NBTTagCompound nbt)`
- `public BlockSnapshot( World world, BlockPos pos, IBlockState state, int flag)`
- `public BlockSnapshot(int dimension, BlockPos pos, java.lang.String modid, java.lang.String blockName, int meta, int flag, NBTTagCompound nbt)`

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

## Description

Represents a captured snapshot of a block which will not change automatically. Unlike Block, which only one object can exist per coordinate, BlockSnapshot can exist multiple times for any given Block.