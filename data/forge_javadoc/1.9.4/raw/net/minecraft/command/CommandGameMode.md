---
title: "CommandGameMode"
description: "public class CommandGameMode extends CommandBase"
package: "net/minecraft/command"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/command/CommandGameMode.html"
sourceType: javadoc
---

# CommandGameMode

## Class signature

```java
public class CommandGameMode extends CommandBase
```

## Constructors

- `public CommandGameMode()`

## Methods

- `public java.lang.String getCommandName()`
- `public int getRequiredPermissionLevel()`
- `public java.lang.String getCommandUsage( ICommandSender sender)`
- `public void execute( MinecraftServer server, ICommandSender sender, java.lang.String[] args) throws CommandException`
- `protected WorldSettings.GameType getGameModeFromCommand( ICommandSender sender, java.lang.String gameModeString) throws CommandException , NumberInvalidException`
- `public java.util.List<java.lang.String> getTabCompletionOptions( MinecraftServer server, ICommandSender sender, java.lang.String[] args, @Nullable BlockPos pos)`
- `public boolean isUsernameIndex(java.lang.String[] args, int index)`
