# TileEntityNote

**Inheritance:** java.lang.Object → net.minecraft.tileentity.TileEntity → net.minecraft.tileentity.TileEntityNote

## Class signature

```java
public class TileEntityNote extends TileEntity
```

## Constructors

- `TileEntityNote()`

## Methods

- `void changePitch()` — change pitch by -> (currentPitch + 1) % 25
- `void readFromNBT(NBTTagCompound compound)`
- `void triggerNote(World worldIn, BlockPos p_175108_2_)`
- `void writeToNBT(NBTTagCompound compound)`

## Fields

- `byte note` — Note to play
- `boolean previousRedstoneState` — stores the latest redstone state