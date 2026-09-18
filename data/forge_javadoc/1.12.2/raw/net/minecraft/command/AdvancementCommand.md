---
title: "AdvancementCommand"
description: "public class AdvancementCommand extends CommandBase"
package: "net/minecraft/command"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/command/AdvancementCommand.html"
sourceType: javadoc
---

# AdvancementCommand

## Class signature

```java
public class AdvancementCommand extends CommandBase
```

## Constructors

- `public AdvancementCommand()`

## Methods

- `public java.lang.String getName()`
- `public int getRequiredPermissionLevel()`
- `public java.lang.String getUsage( ICommandSender sender)`
- `public void execute( MinecraftServer server, ICommandSender sender, java.lang.String[] args) throws CommandException`
- `public java.util.List<java.lang.String> getTabCompletions( MinecraftServer server, ICommandSender sender, java.lang.String[] args, BlockPos targetPos)`
- `public boolean isUsernameIndex(java.lang.String[] args, int index)`
- `public static Advancement findAdvancement( MinecraftServer server, java.lang.String id) throws CommandException`
