---
title: "ForgeCommand"
description: "public class ForgeCommand extends CommandBase"
package: "net/minecraftforge/server/command"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/server/command/ForgeCommand.html"
sourceType: javadoc
---

# ForgeCommand

**Inheritance:** java.lang.Object → net.minecraft.command.CommandBase → net.minecraftforge.server.command.ForgeCommand

## Class signature

```java
public class ForgeCommand extends CommandBase
```

## Constructors

- `ForgeCommand(MinecraftServer server)`

## Methods

- `java.util.List<java.lang.String> addTabCompletionOptions(ICommandSender sender, java.lang.String[] args, BlockPos pos)`
- `java.lang.String getCommandName()` — Gets the name of the command
- `java.lang.String getCommandUsage(ICommandSender icommandsender)` — Gets the usage string for the command.
- `int getRequiredPermissionLevel()` — Return the required permission level for this command.
- `void processCommand(ICommandSender sender, java.lang.String[] args)` — Callback when the command is invoked
