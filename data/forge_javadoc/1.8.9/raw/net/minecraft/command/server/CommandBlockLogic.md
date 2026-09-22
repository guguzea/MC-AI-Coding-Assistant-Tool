---
title: "CommandBlockLogic"
description: "public abstract class CommandBlockLogic extends java.lang.Object implements ICommandSender"
package: "net/minecraft/command/server"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/command/server/CommandBlockLogic.html"
sourceType: javadoc
---

# CommandBlockLogic

**Inheritance:** java.lang.Object → net.minecraft.command.server.CommandBlockLogic

## Class signature

```java
public abstract class CommandBlockLogic extends java.lang.Object implements ICommandSender
```

## Constructors

- `CommandBlockLogic()`

## Methods

- `void addChatMessage(IChatComponent component)` — Send a chat message to the CommandSender
- `boolean canCommandSenderUseCommand(int permLevel, java.lang.String commandName)` — Returns true if the CommandSender is allowed to execute the command, false if not
- `abstract int func_145751_f()`
- `abstract void func_145757_a(ByteBuf p_145757_1_)`
- `java.lang.String getCommand()` — Returns the command of the command block.
- `CommandResultStats getCommandResultStats()`
- `IChatComponent getDisplayName()` — Get the formatted ChatComponent that will be used for the sender's username in chat
- `IChatComponent getLastOutput()` — Returns the lastOutput.
- `java.lang.String getName()` — Get the name of this object.
- `int getSuccessCount()` — returns the successCount int.
- `void readDataFromNBT(NBTTagCompound nbt)` — Reads NBT formatting and stored data into variables.
- `boolean sendCommandFeedback()` — Returns true if the command sender should be sent feedback about executed commands
- `void setCommand(java.lang.String command)` — Sets the command.
- `void setCommandStat(CommandResultStats.Type type, int amount)`
- `void setLastOutput(IChatComponent lastOutputMessage)`
- `void setName(java.lang.String p_145754_1_)`
- `void setTrackOutput(boolean shouldTrackOutput)`
- `boolean shouldTrackOutput()`
- `void trigger(World worldIn)`
- `boolean tryOpenEditCommandBlock(EntityPlayer playerIn)`
- `abstract void updateCommand()`
- `void writeDataToNBT(NBTTagCompound tagCompound)` — Stores data to NBT format.
