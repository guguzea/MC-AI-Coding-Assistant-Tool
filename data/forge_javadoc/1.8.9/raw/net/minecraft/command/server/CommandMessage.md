---
title: "CommandMessage"
description: "Gets the name of the command"
package: "net/minecraft/command/server"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/command/server/CommandMessage.html"
sourceType: javadoc
---

# CommandMessage

## Class signature

```java
public class CommandMessage extends CommandBase
```

## Constructors

- `public CommandMessage()`

## Methods

- `public java.util.List<java.lang.String> getCommandAliases()`
- `public java.lang.String getCommandName()`
- `public int getRequiredPermissionLevel()`
- `public java.lang.String getCommandUsage( ICommandSender sender)`
- `public void processCommand( ICommandSender sender, java.lang.String[] args) throws CommandException`
- `public java.util.List<java.lang.String> addTabCompletionOptions( ICommandSender sender, java.lang.String[] args, BlockPos pos)`
- `public boolean isUsernameIndex(java.lang.String[] args, int index)`

## Description

Gets the name of the command
