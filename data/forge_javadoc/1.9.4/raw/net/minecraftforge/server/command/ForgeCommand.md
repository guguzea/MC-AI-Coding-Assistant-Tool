---
title: "ForgeCommand"
description: "public class ForgeCommand extends CommandBase"
package: "net/minecraftforge/server/command"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/server/command/ForgeCommand.html"
sourceType: javadoc
---

# ForgeCommand

## Class signature

```java
public class ForgeCommand extends CommandBase
```

## Constructors

- `public ForgeCommand()`

## Methods

- `public java.lang.String getCommandName()`
- `public java.lang.String getCommandUsage( ICommandSender icommandsender)`
- `public int getRequiredPermissionLevel()`
- `public void execute( MinecraftServer server, ICommandSender sender, java.lang.String[] args) throws CommandException`
- `public java.util.List<java.lang.String> getTabCompletionOptions( MinecraftServer server, ICommandSender sender, java.lang.String[] args, BlockPos pos)`
