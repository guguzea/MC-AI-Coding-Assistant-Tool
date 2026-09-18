---
title: "CommandHandler"
description: "adds the command and any aliases it has to the internal map of available commands"
package: "net/minecraft/command"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/command/CommandHandler.html"
sourceType: javadoc
---

# CommandHandler

## Class signature

```java
public class CommandHandler extends java.lang.Object implements ICommandManager
```

## Constructors

- `public CommandHandler()`

## Methods

- `public int executeCommand( ICommandSender sender, java.lang.String rawCommand)`
- `protected boolean tryExecute( ICommandSender sender, java.lang.String[] args, ICommand command, java.lang.String input)`
- `public ICommand registerCommand( ICommand command)`
- `public java.util.List<java.lang.String> getTabCompletionOptions( ICommandSender sender, java.lang.String input, BlockPos pos)`
- `public java.util.List< ICommand > getPossibleCommands( ICommandSender sender)`
- `public java.util.Map<java.lang.String, ICommand > getCommands()`

## Description

adds the command and any aliases it has to the internal map of available commands
