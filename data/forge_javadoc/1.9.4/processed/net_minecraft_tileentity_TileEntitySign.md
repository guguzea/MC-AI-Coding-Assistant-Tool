# TileEntitySign

**Inheritance:** java.lang.Object → net.minecraft.tileentity.TileEntity → net.minecraft.tileentity.TileEntitySign

## Class signature

```java
public class TileEntitySign extends TileEntity
```

## Constructors

- `TileEntitySign()`

## Methods

- `boolean executeCommand(EntityPlayer playerIn)`
- `boolean getIsEditable()`
- `EntityPlayer getPlayer()`
- `CommandResultStats getStats()`
- `SPacketUpdateTileEntity getUpdatePacket()`
- `NBTTagCompound getUpdateTag()`
- `boolean onlyOpsCanSetNbt()`
- `void readFromNBT(NBTTagCompound compound)`
- `void setEditable(boolean isEditableIn)`
- `void setPlayer(EntityPlayer playerIn)`
- `NBTTagCompound writeToNBT(NBTTagCompound compound)`

## Fields

- `int lineBeingEdited`
- `ITextComponent [] signText`