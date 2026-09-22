---
title: "CommandClearInventory"
description: "public class CommandClearInventory extends CommandBase"
package: "net/minecraft/command"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/command/CommandClearInventory.html"
sourceType: javadoc
---

# CommandClearInventory

**Inheritance:** java.lang.Object → net.minecraft.command.CommandBase → net.minecraft.command.CommandClearInventory

## Class signature

```java
public class CommandClearInventory extends CommandBase
```

## Constructors

- `CommandClearInventory()`

## Methods

- `java.util.List<java.lang.String> addTabCompletionOptions(ICommandSender sender, java.lang.String[] args, BlockPos pos)`
- `protected java.lang.String[] func_147209_d()`
- `java.lang.String getCommandName()` — Gets the name of the command
- `java.lang.String getCommandUsage(ICommandSender sender)` — Gets the usage string for the command.
- `int getRequiredPermissionLevel()` — Return the required permission level for this command.
- `boolean isUsernameIndex(java.lang.String[] args, int index)` — Return whether the specified command parameter index is a username parameter.
- `void processCommand(ICommandSender sender, java.lang.String[] args)` — Callback when the command is invoked
