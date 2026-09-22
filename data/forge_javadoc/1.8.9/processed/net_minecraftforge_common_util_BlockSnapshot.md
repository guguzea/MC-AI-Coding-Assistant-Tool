# BlockSnapshot

**Inheritance:** java.lang.Object → net.minecraftforge.common.util.BlockSnapshot

## Class signature

```java
public class BlockSnapshot extends java.lang.Object implements java.io.Serializable
```

## Constructors

- `BlockSnapshot(int dimension, BlockPos pos, java.lang.String modid, java.lang.String blockName, int meta, int flag, NBTTagCompound nbt)`
- `BlockSnapshot(World world, BlockPos pos, IBlockState state)`
- `BlockSnapshot(World world, BlockPos pos, IBlockState state, int flag)`
- `BlockSnapshot(World world, BlockPos pos, IBlockState state, NBTTagCompound nbt)`

## Methods

- `boolean equals(java.lang.Object obj)`
- `static BlockSnapshot getBlockSnapshot(World world, BlockPos pos)`
- `static BlockSnapshot getBlockSnapshot(World world, BlockPos pos, int flag)`
- `IBlockState getCurrentBlock()`
- `IBlockState getReplacedBlock()`
- `TileEntity getTileEntity()`
- `World getWorld()`
- `int hashCode()`
- `static BlockSnapshot readFromNBT(NBTTagCompound tag)`
- `boolean restore()`
- `boolean restore(boolean force)`
- `boolean restore(boolean force, boolean applyPhysics)`
- `boolean restoreToLocation(World world, BlockPos pos, boolean force, boolean applyPhysics)`
- `void writeToNBT(NBTTagCompound compound)`

## Fields

- `GameRegistry.UniqueIdentifier blockIdentifier`
- `int dimId`
- `int flag`
- `int meta`
- `BlockPos pos`
- `IBlockState replacedBlock`
- `World world`