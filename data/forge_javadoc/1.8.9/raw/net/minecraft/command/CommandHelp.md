---
title: "CommandHelp"
description: "Gets the name of the command"
package: "net/minecraft/command"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/command/CommandHelp.html"
sourceType: javadoc
---

# CommandHelp

## Class signature

```java
public class CommandHelp extends CommandBase
```

## Constructors

- `public CommandHelp()`

## Methods

- `public java.lang.String getCommandName()`
- `public int getRequiredPermissionLevel()`
- `public java.lang.String getCommandUsage( ICommandSender sender)`
- `public java.util.List<java.lang.String> getCommandAliases()`
- `public void processCommand( ICommandSender sender, java.lang.String[] args) throws CommandException`
- `protected java.util.List< ICommand > getSortedPossibleCommands( ICommandSender p_71534_1_)`
- `protected java.util.Map<java.lang.String, ICommand > getCommands()`
- `public java.util.List<java.lang.String> addTabCompletionOptions( ICommandSender sender, java.lang.String[] args, BlockPos pos)`

## Description

Gets the name of the command
