# TileEntityPiston

**Inheritance:** java.lang.Object → net.minecraft.tileentity.TileEntity → net.minecraft.tileentity.TileEntityPiston

## Class signature

```java
public class TileEntityPiston extends TileEntity implements ITickable
```

## Methods

- `void addCollissionAABBs(World p_190609_1_, BlockPos p_190609_2_, AxisAlignedBB p_190609_3_, java.util.List<AxisAlignedBB> p_190609_4_, Entity p_190609_5_)`
- `void clearPistonTileEntity()`
- `AxisAlignedBB getAABB(IBlockAccess p_184321_1_, BlockPos p_184321_2_)`
- `AxisAlignedBB getAABB(IBlockAccess p_184319_1_, BlockPos p_184319_2_, float p_184319_3_)`
- `int getBlockMetadata()`
- `EnumFacing getFacing()`
- `float getOffsetX(float ticks)`
- `float getOffsetY(float ticks)`
- `float getOffsetZ(float ticks)`
- `IBlockState getPistonState()`
- `float getProgress(float ticks)`
- `NBTTagCompound getUpdateTag()`
- `boolean isExtending()`
- `void readFromNBT(NBTTagCompound compound)`
- `static void registerFixesPiston(DataFixer fixer)`
- `boolean shouldPistonHeadBeRendered()`
- `void update()`
- `NBTTagCompound writeToNBT(NBTTagCompound compound)`

## Fields

- `TileEntityPiston`
- `TileEntityPiston`