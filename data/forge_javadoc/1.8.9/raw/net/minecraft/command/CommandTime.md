---
title: "CommandTime"
description: "public class CommandTime extends CommandBase"
package: "net/minecraft/command"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/command/CommandTime.html"
sourceType: javadoc
---

# CommandTime

**Inheritance:** java.lang.Object → net.minecraft.command.CommandBase → net.minecraft.command.CommandTime

## Class signature

```java
public class CommandTime extends CommandBase
```

## Constructors

- `CommandTime()`

## Methods

- `java.util.List<java.lang.String> addTabCompletionOptions(ICommandSender sender, java.lang.String[] args, BlockPos pos)`
- `protected void addTime(ICommandSender p_71553_1_, int p_71553_2_)` — Adds (or removes) time in the server object.
- `java.lang.String getCommandName()` — Gets the name of the command
- `java.lang.String getCommandUsage(ICommandSender sender)` — Gets the usage string for the command.
- `int getRequiredPermissionLevel()` — Return the required permission level for this command.
- `void processCommand(ICommandSender sender, java.lang.String[] args)` — Callback when the command is invoked
- `protected void setTime(ICommandSender p_71552_1_, int p_71552_2_)` — Set the time in the server object.
