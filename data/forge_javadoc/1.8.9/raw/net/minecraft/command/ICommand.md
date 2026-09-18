---
title: "ICommand"
description: "Returns true if the given command sender is allowed to use this command."
package: "net/minecraft/command"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/command/ICommand.html"
sourceType: javadoc
---

# ICommand

## Class signature

```java
public interface ICommand extends java.lang.Comparable< ICommand >
```

## Methods

- `java.lang.String getCommandName()`
- `java.lang.String getCommandUsage( ICommandSender sender)`
- `java.util.List<java.lang.String> getCommandAliases()`
- `void processCommand( ICommandSender sender, java.lang.String[] args) throws CommandException`
- `boolean canCommandSenderUseCommand( ICommandSender sender)`
- `java.util.List<java.lang.String> addTabCompletionOptions( ICommandSender sender, java.lang.String[] args, BlockPos pos)`
- `boolean isUsernameIndex(java.lang.String[] args, int index)`

## Description

Returns true if the given command sender is allowed to use this command.
