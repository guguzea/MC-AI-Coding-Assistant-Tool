---
title: "CommandHelp"
description: "public class CommandHelp extends CommandBase"
package: "net/minecraft/command"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/command/CommandHelp.html"
sourceType: javadoc
---

# CommandHelp

## Class signature

```java
public class CommandHelp extends CommandBase
```

## Constructors

- `public CommandHelp()`

## Methods

- `public java.lang.String getName()`
- `public int getRequiredPermissionLevel()`
- `public java.lang.String getUsage( ICommandSender sender)`
- `public java.util.List<java.lang.String> getAliases()`
- `public void execute( MinecraftServer server, ICommandSender sender, java.lang.String[] args) throws CommandException`
- `protected java.util.List< ICommand > getSortedPossibleCommands( ICommandSender sender, MinecraftServer server)`
- `protected java.util.Map<java.lang.String, ICommand > getCommandMap( MinecraftServer server)`
- `public java.util.List<java.lang.String> getTabCompletions( MinecraftServer server, ICommandSender sender, java.lang.String[] args, @Nullable BlockPos targetPos)`
