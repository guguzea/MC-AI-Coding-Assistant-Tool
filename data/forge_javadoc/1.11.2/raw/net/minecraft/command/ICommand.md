---
title: "ICommand"
description: "public interface ICommand extends java.lang.Comparable< ICommand >"
package: "net/minecraft/command"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/command/ICommand.html"
sourceType: javadoc
---

# ICommand

## Class signature

```java
public interface ICommand extends java.lang.Comparable< ICommand >
```

## Methods

- `java.lang.String getName()`
- `java.lang.String getUsage( ICommandSender sender)`
- `java.util.List<java.lang.String> getAliases()`
- `void execute( MinecraftServer server, ICommandSender sender, java.lang.String[] args) throws CommandException`
- `boolean checkPermission( MinecraftServer server, ICommandSender sender)`
- `java.util.List<java.lang.String> getTabCompletions( MinecraftServer server, ICommandSender sender, java.lang.String[] args, @Nullable BlockPos targetPos)`
- `boolean isUsernameIndex(java.lang.String[] args, int index)`
