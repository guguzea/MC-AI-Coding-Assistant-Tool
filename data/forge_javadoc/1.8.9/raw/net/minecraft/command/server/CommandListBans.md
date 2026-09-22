---
title: "CommandListBans"
description: "public class CommandListBans extends CommandBase"
package: "net/minecraft/command/server"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/command/server/CommandListBans.html"
sourceType: javadoc
---

# CommandListBans

**Inheritance:** java.lang.Object → net.minecraft.command.CommandBase → net.minecraft.command.server.CommandListBans

## Class signature

```java
public class CommandListBans extends CommandBase
```

## Constructors

- `CommandListBans()`

## Methods

- `java.util.List<java.lang.String> addTabCompletionOptions(ICommandSender sender, java.lang.String[] args, BlockPos pos)`
- `boolean canCommandSenderUseCommand(ICommandSender sender)` — Returns true if the given command sender is allowed to use this command.
- `java.lang.String getCommandName()` — Gets the name of the command
- `java.lang.String getCommandUsage(ICommandSender sender)` — Gets the usage string for the command.
- `int getRequiredPermissionLevel()` — Return the required permission level for this command.
- `void processCommand(ICommandSender sender, java.lang.String[] args)` — Callback when the command is invoked
