---
title: "CommandStats"
description: "public class CommandStats extends CommandBase"
package: "net/minecraft/command"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/command/CommandStats.html"
sourceType: javadoc
---

# CommandStats

**Inheritance:** java.lang.Object → net.minecraft.command.CommandBase → net.minecraft.command.CommandStats

## Class signature

```java
public class CommandStats extends CommandBase
```

## Constructors

- `CommandStats()`

## Methods

- `void execute(MinecraftServer server, ICommandSender sender, java.lang.String[] args)`
- `java.lang.String getCommandName()`
- `java.lang.String getCommandUsage(ICommandSender sender)`
- `protected java.util.List<java.lang.String> getObjectiveNames(MinecraftServer server)`
- `int getRequiredPermissionLevel()`
- `java.util.List<java.lang.String> getTabCompletionOptions(MinecraftServer server, ICommandSender sender, java.lang.String[] args, BlockPos pos)`
- `boolean isUsernameIndex(java.lang.String[] args, int index)`
