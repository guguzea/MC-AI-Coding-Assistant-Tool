---
title: "CommandTime"
description: "public class CommandTime extends CommandBase"
package: "net/minecraft/command"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/command/CommandTime.html"
sourceType: javadoc
---

# CommandTime

**Inheritance:** java.lang.Object → net.minecraft.command.CommandBase → net.minecraft.command.CommandTime

## Class signature

```java
public class CommandTime extends CommandBase
```

## Constructors

- `CommandTime()`

## Methods

- `void execute(MinecraftServer server, ICommandSender sender, java.lang.String[] args)`
- `java.lang.String getCommandName()`
- `java.lang.String getCommandUsage(ICommandSender sender)`
- `int getRequiredPermissionLevel()`
- `java.util.List<java.lang.String> getTabCompletionOptions(MinecraftServer server, ICommandSender sender, java.lang.String[] args, BlockPos pos)`
- `protected void incrementAllWorldTimes(MinecraftServer server, int amount)`
- `protected void setAllWorldTimes(MinecraftServer server, int time)`
