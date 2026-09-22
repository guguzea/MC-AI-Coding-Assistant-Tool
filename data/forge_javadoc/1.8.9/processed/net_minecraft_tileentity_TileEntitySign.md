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
- `boolean func_183000_F()`
- `Packet getDescriptionPacket()` — Allows for a specialized description packet to be created.
- `boolean getIsEditable()`
- `EntityPlayer getPlayer()`
- `CommandResultStats getStats()`
- `void readFromNBT(NBTTagCompound compound)`
- `void setEditable(boolean isEditableIn)` — Sets the sign's isEditable flag to the specified parameter.
- `void setPlayer(EntityPlayer playerIn)`
- `void writeToNBT(NBTTagCompound compound)`

## Fields

- `int lineBeingEdited` — The index of the line currently being edited.
- `IChatComponent [] signText`