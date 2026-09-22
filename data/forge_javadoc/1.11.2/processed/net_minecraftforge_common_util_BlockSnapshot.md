# BlockSnapshot

**Inheritance:** java.lang.Object → net.minecraftforge.common.util.BlockSnapshot

## Class signature

```java
public class BlockSnapshot extends java.lang.Object implements java.io.Serializable
```

## Constructors

- `BlockSnapshot(int dimension, BlockPos pos, java.lang.String modId, java.lang.String blockName, int meta, int flag, NBTTagCompound nbt)`
- `BlockSnapshot(World world, BlockPos pos, IBlockState state)`
- `BlockSnapshot(World world, BlockPos pos, IBlockState state, int flag)`
- `BlockSnapshot(World world, BlockPos pos, IBlockState state, NBTTagCompound nbt)`

## Methods

- `boolean equals(java.lang.Object obj)`
- `static BlockSnapshot getBlockSnapshot(World world, BlockPos pos)`
- `static BlockSnapshot getBlockSnapshot(World world, BlockPos pos, int flag)`
- `IBlockState getCurrentBlock()`
- `int getDimId()`
- `int getFlag()`
- `int getMeta()`
- `NBTTagCompound getNbt()`
- `BlockPos getPos()`
- `ResourceLocation getRegistryName()`
- `IBlockState getReplacedBlock()`
- `TileEntity getTileEntity()`
- `World getWorld()`
- `int hashCode()`
- `static BlockSnapshot readFromNBT(NBTTagCompound tag)`
- `boolean restore()`
- `boolean restore(boolean force)`
- `boolean restore(boolean force, boolean applyPhysics)`
- `boolean restoreToLocation(World world, BlockPos pos, boolean force, boolean applyPhysics)`
- `void setFlag(int flag)`
- `void setReplacedBlock(IBlockState replacedBlock)`
- `void setWorld(World world)`
- `void writeToNBT(NBTTagCompound compound)`