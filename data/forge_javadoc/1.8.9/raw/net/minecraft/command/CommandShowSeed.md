---
title: "CommandShowSeed"
description: "Returns true if the given command sender is allowed to use this command."
package: "net/minecraft/command"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/command/CommandShowSeed.html"
sourceType: javadoc
---

# CommandShowSeed

## Class signature

```java
public class CommandShowSeed extends CommandBase
```

## Constructors

- `public CommandShowSeed()`

## Methods

- `public boolean canCommandSenderUseCommand( ICommandSender sender)`
- `public java.lang.String getCommandName()`
- `public int getRequiredPermissionLevel()`
- `public java.lang.String getCommandUsage( ICommandSender sender)`
- `public void processCommand( ICommandSender sender, java.lang.String[] args) throws CommandException`

## Description

Returns true if the given command sender is allowed to use this command.
