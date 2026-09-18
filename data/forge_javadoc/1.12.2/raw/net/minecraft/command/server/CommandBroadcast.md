---
title: "CommandBroadcast"
description: "public class CommandBroadcast extends CommandBase"
package: "net/minecraft/command/server"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/command/server/CommandBroadcast.html"
sourceType: javadoc
---

# CommandBroadcast

## Class signature

```java
public class CommandBroadcast extends CommandBase
```

## Constructors

- `public CommandBroadcast()`

## Methods

- `public java.lang.String getName()`
- `public int getRequiredPermissionLevel()`
- `public java.lang.String getUsage( ICommandSender sender)`
- `public void execute( MinecraftServer server, ICommandSender sender, java.lang.String[] args) throws CommandException`
- `public java.util.List<java.lang.String> getTabCompletions( MinecraftServer server, ICommandSender sender, java.lang.String[] args, BlockPos targetPos)`
