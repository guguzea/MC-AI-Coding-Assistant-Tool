---
title: "CommandTrigger"
description: "Gets the name of the command"
package: "net/minecraft/command"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/command/CommandTrigger.html"
sourceType: javadoc
---

# CommandTrigger

## Class signature

```java
public class CommandTrigger extends CommandBase
```

## Constructors

- `public CommandTrigger()`

## Methods

- `public java.lang.String getCommandName()`
- `public int getRequiredPermissionLevel()`
- `public java.lang.String getCommandUsage( ICommandSender sender)`
- `public void processCommand( ICommandSender sender, java.lang.String[] args) throws CommandException`
- `public java.util.List<java.lang.String> addTabCompletionOptions( ICommandSender sender, java.lang.String[] args, BlockPos pos)`

## Description

Gets the name of the command
