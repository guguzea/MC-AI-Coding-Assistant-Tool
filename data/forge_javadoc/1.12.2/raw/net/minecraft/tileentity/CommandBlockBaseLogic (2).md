---
title: "CommandBlockBaseLogic"
description: "public abstract class CommandBlockBaseLogic extends java.lang.Object implements ICommandSender"
package: "net/minecraft/tileentity"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/tileentity/CommandBlockBaseLogic.html"
sourceType: javadoc
---

# CommandBlockBaseLogic

## Class signature

```java
public abstract class CommandBlockBaseLogic extends java.lang.Object implements ICommandSender
```

## Constructors

- `public CommandBlockBaseLogic()`

## Methods

- `public int getSuccessCount()`
- `public void setSuccessCount(int successCountIn)`
- `public ITextComponent getLastOutput()`
- `public NBTTagCompound writeToNBT( NBTTagCompound p_189510_1_)`
- `public void readDataFromNBT( NBTTagCompound nbt)`
- `public boolean canUseCommand(int permLevel, java.lang.String commandName)`
- `public void setCommand(java.lang.String command)`
- `public java.lang.String getCommand()`
- `public boolean trigger( World worldIn)`
- `public java.lang.String getName()`
- `public void setName(java.lang.String name)`
- `public void sendMessage( ITextComponent component)`
- `public boolean sendCommandFeedback()`
- `public void setCommandStat( CommandResultStats.Type type, int amount)`
- `public abstract void updateCommand()`
- `public abstract int getCommandBlockType()`
- `public abstract void fillInInfo(ByteBuf buf)`
- `public void setLastOutput( ITextComponent lastOutputMessage)`
- `public void setTrackOutput(boolean shouldTrackOutput)`
- `public boolean shouldTrackOutput()`
- `public boolean tryOpenEditCommandBlock( EntityPlayer playerIn)`
- `public CommandResultStats getCommandResultStats()`
