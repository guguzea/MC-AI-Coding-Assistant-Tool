---
title: "ForgeCommand"
description: "Gets the name of the command"
package: "net/minecraftforge/server/command"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/server/command/ForgeCommand.html"
sourceType: javadoc
---

# ForgeCommand

## Class signature

```java
public class ForgeCommand extends CommandBase
```

## Constructors

- `public ForgeCommand( MinecraftServer server)`

## Methods

- `public java.lang.String getCommandName()`
- `public java.lang.String getCommandUsage( ICommandSender icommandsender)`
- `public int getRequiredPermissionLevel()`
- `public void processCommand( ICommandSender sender, java.lang.String[] args) throws CommandException`
- `public java.util.List<java.lang.String> addTabCompletionOptions( ICommandSender sender, java.lang.String[] args, BlockPos pos)`

## Description

Gets the name of the command
