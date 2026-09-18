# TileEntitySign

## Class signature

```java
public class TileEntitySign extends TileEntity
```

## Constructors

- `public TileEntitySign()`

## Methods

- `public NBTTagCompound writeToNBT( NBTTagCompound compound)`
- `public void readFromNBT( NBTTagCompound compound)`
- `@Nullable public SPacketUpdateTileEntity getUpdatePacket()`
- `public NBTTagCompound getUpdateTag()`
- `public boolean onlyOpsCanSetNbt()`
- `public boolean getIsEditable()`
- `public void setEditable(boolean isEditableIn)`
- `public void setPlayer( EntityPlayer playerIn)`
- `public EntityPlayer getPlayer()`
- `public boolean executeCommand( EntityPlayer playerIn)`
- `public CommandResultStats getStats()`