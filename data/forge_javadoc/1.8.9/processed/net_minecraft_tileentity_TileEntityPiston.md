# TileEntityPiston

**Inheritance:** java.lang.Object → net.minecraft.tileentity.TileEntity → net.minecraft.tileentity.TileEntityPiston

## Class signature

```java
public class TileEntityPiston extends TileEntity implements ITickable
```

## Methods

- `void clearPistonTileEntity()` — removes a piston's tile entity (and if the piston is moving, stops it)
- `int getBlockMetadata()`
- `EnumFacing getFacing()`
- `float getOffsetX(float ticks)`
- `float getOffsetY(float ticks)`
- `float getOffsetZ(float ticks)`
- `IBlockState getPistonState()`
- `float getProgress(float ticks)` — Get interpolated progress value (between lastProgress and progress) given the fractional time between ticks as an argument
- `boolean isExtending()` — Returns true if a piston is extending
- `void readFromNBT(NBTTagCompound compound)`
- `boolean shouldPistonHeadBeRendered()`
- `void update()` — Like the old updateEntity(), except more generic.
- `void writeToNBT(NBTTagCompound compound)`

## Fields

- `TileEntityPiston`
- `TileEntityPiston`