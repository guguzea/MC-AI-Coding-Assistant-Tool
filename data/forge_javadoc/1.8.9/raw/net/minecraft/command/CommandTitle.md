---
title: "CommandTitle"
description: "Gets the name of the command"
package: "net/minecraft/command"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/command/CommandTitle.html"
sourceType: javadoc
---

# CommandTitle

## Class signature

```java
public class CommandTitle extends CommandBase
```

## Constructors

- `public CommandTitle()`

## Methods

- `public java.lang.String getCommandName()`
- `public int getRequiredPermissionLevel()`
- `public java.lang.String getCommandUsage( ICommandSender sender)`
- `public void processCommand( ICommandSender sender, java.lang.String[] args) throws CommandException`
- `public java.util.List<java.lang.String> addTabCompletionOptions( ICommandSender sender, java.lang.String[] args, BlockPos pos)`
- `public boolean isUsernameIndex(java.lang.String[] args, int index)`

## Description

Gets the name of the command
