---
title: "CommandWorldBorder"
description: "public class CommandWorldBorder extends CommandBase"
package: "net/minecraft/command"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/command/CommandWorldBorder.html"
sourceType: javadoc
---

# CommandWorldBorder

## Class signature

```java
public class CommandWorldBorder extends CommandBase
```

## Constructors

- `public CommandWorldBorder()`

## Methods

- `public java.lang.String getCommandName()`
- `public int getRequiredPermissionLevel()`
- `public java.lang.String getCommandUsage( ICommandSender sender)`
- `public void execute( MinecraftServer server, ICommandSender sender, java.lang.String[] args) throws CommandException`
- `protected WorldBorder getWorldBorder( MinecraftServer server)`
- `public java.util.List<java.lang.String> getTabCompletionOptions( MinecraftServer server, ICommandSender sender, java.lang.String[] args, @Nullable BlockPos pos)`
