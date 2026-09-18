---
title: "CommandBlockLogic"
description: "Send a chat message to the CommandSender"
package: "net/minecraft/command/server"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/command/server/CommandBlockLogic.html"
sourceType: javadoc
---

# CommandBlockLogic

## Class signature

```java
public abstract class CommandBlockLogic extends java.lang.Object implements ICommandSender
```

## Constructors

- `public CommandBlockLogic()`

## Methods

- `public int getSuccessCount()`
- `public IChatComponent getLastOutput()`
- `public void writeDataToNBT( NBTTagCompound tagCompound)`
- `public void readDataFromNBT( NBTTagCompound nbt)`
- `public boolean canCommandSenderUseCommand(int permLevel, java.lang.String commandName)`
- `public void setCommand(java.lang.String command)`
- `public java.lang.String getCommand()`
- `public void trigger( World worldIn)`
- `public java.lang.String getName()`
- `public IChatComponent getDisplayName()`
- `public void setName(java.lang.String p_145754_1_)`
- `public void addChatMessage( IChatComponent component)`
- `public boolean sendCommandFeedback()`
- `public void setCommandStat( CommandResultStats.Type type, int amount)`
- `public abstract void updateCommand()`
- `public abstract int func_145751_f()`
- `public abstract void func_145757_a(ByteBuf p_145757_1_)`
- `public void setLastOutput( IChatComponent lastOutputMessage)`
- `public void setTrackOutput(boolean shouldTrackOutput)`
- `public boolean shouldTrackOutput()`
- `public boolean tryOpenEditCommandBlock( EntityPlayer playerIn)`
- `public CommandResultStats getCommandResultStats()`

## Description

Send a chat message to the CommandSender
