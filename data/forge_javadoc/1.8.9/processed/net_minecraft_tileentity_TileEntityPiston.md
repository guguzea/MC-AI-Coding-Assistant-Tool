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
- `public void clearPistonTileEntity()`
- `public void update()`
- `public void readFromNBT( NBTTagCompound compound)`
- `public void writeToNBT( NBTTagCompound compound)`

## Description

removes a piston's tile entity (and if the piston is moving, stops it)