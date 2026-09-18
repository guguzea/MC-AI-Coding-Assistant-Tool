---
title: "CommandBanPlayer"
description: "Returns true if the given command sender is allowed to use this command."
package: "net/minecraft/command/server"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/command/server/CommandBanPlayer.html"
sourceType: javadoc
---

# CommandBanPlayer

## Class signature

```java
public class CommandBanPlayer extends CommandBase
```

## Constructors

- `public CommandBanPlayer()`

## Methods

- `public java.lang.String getCommandName()`
- `public int getRequiredPermissionLevel()`
- `public java.lang.String getCommandUsage( ICommandSender sender)`
- `public boolean canCommandSenderUseCommand( ICommandSender sender)`
- `public void processCommand( ICommandSender sender, java.lang.String[] args) throws CommandException`
- `public java.util.List<java.lang.String> addTabCompletionOptions( ICommandSender sender, java.lang.String[] args, BlockPos pos)`

## Description

Returns true if the given command sender is allowed to use this command.
