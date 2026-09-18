---
title: "CommandReplaceItem"
description: "Gets the name of the command"
package: "net/minecraft/command"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/command/CommandReplaceItem.html"
sourceType: javadoc
---

# CommandReplaceItem

## Class signature

```java
public class CommandReplaceItem extends CommandBase
```

## Constructors

- `public CommandReplaceItem()`

## Methods

- `public java.lang.String getCommandName()`
- `public int getRequiredPermissionLevel()`
- `public java.lang.String getCommandUsage( ICommandSender sender)`
- `public void processCommand( ICommandSender sender, java.lang.String[] args) throws CommandException`
- `public java.util.List<java.lang.String> addTabCompletionOptions( ICommandSender sender, java.lang.String[] args, BlockPos pos)`
- `protected java.lang.String[] getUsernames()`
- `public boolean isUsernameIndex(java.lang.String[] args, int index)`

## Description

Gets the name of the command
