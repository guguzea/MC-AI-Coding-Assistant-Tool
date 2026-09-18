---
title: "CommandDifficulty"
description: "Gets the name of the command"
package: "net/minecraft/command"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/command/CommandDifficulty.html"
sourceType: javadoc
---

# CommandDifficulty

## Class signature

```java
public class CommandDifficulty extends CommandBase
```

## Constructors

- `public CommandDifficulty()`

## Methods

- `public java.lang.String getCommandName()`
- `public int getRequiredPermissionLevel()`
- `public java.lang.String getCommandUsage( ICommandSender sender)`
- `public void processCommand( ICommandSender sender, java.lang.String[] args) throws CommandException`
- `protected EnumDifficulty getDifficultyFromCommand(java.lang.String p_180531_1_) throws CommandException , NumberInvalidException`
- `public java.util.List<java.lang.String> addTabCompletionOptions( ICommandSender sender, java.lang.String[] args, BlockPos pos)`

## Description

Gets the name of the command
