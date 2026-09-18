---
title: "TileEntityCommandBlock"
description: "public class TileEntityCommandBlock extends TileEntity"
package: "net/minecraft/tileentity"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/tileentity/TileEntityCommandBlock.html"
sourceType: javadoc
---

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
- `@Nullable public SPacketUpdateTileEntity getUpdatePacket()`
- `public boolean onlyOpsCanSetNbt()`
- `public CommandBlockBaseLogic getCommandBlockLogic()`
- `public CommandResultStats getCommandResultStats()`
- `public void setPowered(boolean poweredIn)`
- `public boolean isPowered()`
- `public boolean isAuto()`
- `public void setAuto(boolean autoIn)`
- `public boolean isConditionMet()`
- `public void setConditionMet(boolean conditionMetIn)`
- `public boolean isSendToClient()`
- `public void setSendToClient(boolean p_184252_1_)`
- `public TileEntityCommandBlock.Mode getMode()`
- `public boolean isConditional()`
- `public void validate()`
