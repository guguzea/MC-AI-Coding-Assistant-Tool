---
title: "CommandGameMode"
description: "public class CommandGameMode extends CommandBase"
package: "net/minecraft/command"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/command/CommandGameMode.html"
sourceType: javadoc
---

# CommandGameMode

**Inheritance:** java.lang.Object → net.minecraft.command.CommandBase → net.minecraft.command.CommandGameMode

## Class signature

```java
public class CommandGameMode extends CommandBase
```

## Constructors

- `CommandGameMode()`

## Methods

- `void execute(MinecraftServer server, ICommandSender sender, java.lang.String[] args)`
- `java.lang.String getCommandName()`
- `java.lang.String getCommandUsage(ICommandSender sender)`
- `protected WorldSettings.GameType getGameModeFromCommand(ICommandSender sender, java.lang.String gameModeString)`
- `int getRequiredPermissionLevel()`
- `java.util.List<java.lang.String> getTabCompletionOptions(MinecraftServer server, ICommandSender sender, java.lang.String[] args, BlockPos pos)`
- `boolean isUsernameIndex(java.lang.String[] args, int index)`
