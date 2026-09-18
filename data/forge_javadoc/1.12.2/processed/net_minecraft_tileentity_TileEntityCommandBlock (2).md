# TileEntityCommandBlock

## Class signature

```java
public class TileEntityCommandBlock extends TileEntity
```

## Constructors

- `public TileEntityCommandBlock()`

## Methods

- `public NBTTagCompound writeToNBT( NBTTagCompound compound)`
- `public void readFromNBT( NBTTagCompound compound)`
- `public SPacketUpdateTileEntity getUpdatePacket()`
- `public boolean onlyOpsCanSetNbt()`
- `public CommandBlockBaseLogic getCommandBlockLogic()`
- `public CommandResultStats getCommandResultStats()`
- `public void setPowered(boolean poweredIn)`
- `public boolean isPowered()`
- `public boolean isAuto()`
- `public void setAuto(boolean autoIn)`
- `public boolean isConditionMet()`
- `public boolean setConditionMet()`
- `public boolean isSendToClient()`
- `public void setSendToClient(boolean p_184252_1_)`
- `public TileEntityCommandBlock.Mode getMode()`
- `public boolean isConditional()`
- `public void validate()`