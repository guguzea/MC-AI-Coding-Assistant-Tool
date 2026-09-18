# TileEntityPiston

## Class signature

```java
public class TileEntityPiston extends TileEntity implements ITickable
```

## Constructors

- `public TileEntityPiston()`
- `public TileEntityPiston( IBlockState pistonStateIn, EnumFacing pistonFacingIn, boolean extendingIn, boolean shouldHeadBeRenderedIn)`

## Methods

- `public IBlockState getPistonState()`
- `public int getBlockMetadata()`
- `public boolean isExtending()`
- `public EnumFacing getFacing()`
- `public boolean shouldPistonHeadBeRendered()`
- `public float getProgress(float ticks)`
- `public float getOffsetX(float ticks)`
- `public float getOffsetY(float ticks)`
- `public float getOffsetZ(float ticks)`
- `public AxisAlignedBB getAABB( IBlockAccess p_184321_1_, BlockPos p_184321_2_)`
- `public AxisAlignedBB getAABB( IBlockAccess p_184319_1_, BlockPos p_184319_2_, float p_184319_3_)`
- `public void clearPistonTileEntity()`
- `public void update()`
- `public void readFromNBT( NBTTagCompound compound)`
- `public NBTTagCompound writeToNBT( NBTTagCompound compound)`