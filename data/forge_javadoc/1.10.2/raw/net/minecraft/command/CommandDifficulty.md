---
title: "CommandDifficulty"
description: "public class CommandDifficulty extends CommandBase"
package: "net/minecraft/command"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/command/CommandDifficulty.html"
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
- `public void execute( MinecraftServer server, ICommandSender sender, java.lang.String[] args) throws CommandException`
- `protected EnumDifficulty getDifficultyFromCommand(java.lang.String difficultyString) throws CommandException , NumberInvalidException`
- `public java.util.List<java.lang.String> getTabCompletionOptions( MinecraftServer server, ICommandSender sender, java.lang.String[] args, @Nullable BlockPos pos)`
