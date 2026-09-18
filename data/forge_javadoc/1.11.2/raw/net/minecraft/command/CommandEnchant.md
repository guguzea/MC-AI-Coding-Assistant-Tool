---
title: "CommandEnchant"
description: "public class CommandEnchant extends CommandBase"
package: "net/minecraft/command"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/command/CommandEnchant.html"
sourceType: javadoc
---

# CommandEnchant

## Class signature

```java
public class CommandEnchant extends CommandBase
```

## Constructors

- `public CommandEnchant()`

## Methods

- `public java.lang.String getName()`
- `public int getRequiredPermissionLevel()`
- `public java.lang.String getUsage( ICommandSender sender)`
- `public void execute( MinecraftServer server, ICommandSender sender, java.lang.String[] args) throws CommandException`
- `public java.util.List<java.lang.String> getTabCompletions( MinecraftServer server, ICommandSender sender, java.lang.String[] args, @Nullable BlockPos targetPos)`
- `public boolean isUsernameIndex(java.lang.String[] args, int index)`
