---
title: "CommandWorldBorder"
description: "public class CommandWorldBorder extends CommandBase"
package: "net/minecraft/command"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/command/CommandWorldBorder.html"
sourceType: javadoc
---

# CommandWorldBorder

**Inheritance:** java.lang.Object → net.minecraft.command.CommandBase → net.minecraft.command.CommandWorldBorder

## Class signature

```java
public class CommandWorldBorder extends CommandBase
```

## Constructors

- `CommandWorldBorder()`

## Methods

- `java.util.List<java.lang.String> addTabCompletionOptions(ICommandSender sender, java.lang.String[] args, BlockPos pos)`
- `java.lang.String getCommandName()` — Gets the name of the command
- `java.lang.String getCommandUsage(ICommandSender sender)` — Gets the usage string for the command.
- `int getRequiredPermissionLevel()` — Return the required permission level for this command.
- `protected WorldBorder getWorldBorder()`
- `void processCommand(ICommandSender sender, java.lang.String[] args)` — Callback when the command is invoked
