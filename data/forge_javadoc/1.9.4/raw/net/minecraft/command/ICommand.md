---
title: "ICommand"
description: "public interface ICommand extends java.lang.Comparable< ICommand >"
package: "net/minecraft/command"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/command/ICommand.html"
sourceType: javadoc
---

# ICommand

## Class signature

```java
public interface ICommand extends java.lang.Comparable< ICommand >
```

## Methods

- `java.lang.String getCommandName()`
- `java.lang.String getCommandUsage( ICommandSender sender)`
- `java.util.List<java.lang.String> getCommandAliases()`
- `void execute( MinecraftServer server, ICommandSender sender, java.lang.String[] args) throws CommandException`
- `boolean checkPermission( MinecraftServer server, ICommandSender sender)`
- `java.util.List<java.lang.String> getTabCompletionOptions( MinecraftServer server, ICommandSender sender, java.lang.String[] args, @Nullable BlockPos pos)`
- `boolean isUsernameIndex(java.lang.String[] args, int index)`
