---
title: "AdvancementCommand"
description: "public class AdvancementCommand extends CommandBase"
package: "net/minecraft/command"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/command/AdvancementCommand.html"
sourceType: javadoc
---

# AdvancementCommand

**Inheritance:** java.lang.Object → net.minecraft.command.CommandBase → net.minecraft.command.AdvancementCommand

## Class signature

```java
public class AdvancementCommand extends CommandBase
```

## Constructors

- `AdvancementCommand()`

## Methods

- `void execute(MinecraftServer server, ICommandSender sender, java.lang.String[] args)`
- `static Advancement findAdvancement(MinecraftServer server, java.lang.String id)`
- `java.lang.String getName()`
- `int getRequiredPermissionLevel()`
- `java.util.List<java.lang.String> getTabCompletions(MinecraftServer server, ICommandSender sender, java.lang.String[] args, BlockPos targetPos)`
- `java.lang.String getUsage(ICommandSender sender)`
- `boolean isUsernameIndex(java.lang.String[] args, int index)`
