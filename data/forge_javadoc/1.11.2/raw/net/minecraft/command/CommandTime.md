---
title: "CommandTime"
description: "public class CommandTime extends CommandBase"
package: "net/minecraft/command"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/command/CommandTime.html"
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
- `java.lang.String getName()`
- `int getRequiredPermissionLevel()`
- `java.util.List<java.lang.String> getTabCompletions(MinecraftServer server, ICommandSender sender, java.lang.String[] args, BlockPos targetPos)`
- `java.lang.String getUsage(ICommandSender sender)`
- `protected void incrementAllWorldTimes(MinecraftServer server, int amount)`
- `protected void setAllWorldTimes(MinecraftServer server, int time)`
