---
title: "CommandMessage"
description: "public class CommandMessage extends CommandBase"
package: "net/minecraft/command/server"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/command/server/CommandMessage.html"
sourceType: javadoc
---

# CommandMessage

## Class signature

```java
public class CommandMessage extends CommandBase
```

## Constructors

- `public CommandMessage()`

## Methods

- `public java.util.List<java.lang.String> getCommandAliases()`
- `public java.lang.String getCommandName()`
- `public int getRequiredPermissionLevel()`
- `public java.lang.String getCommandUsage( ICommandSender sender)`
- `public void execute( MinecraftServer server, ICommandSender sender, java.lang.String[] args) throws CommandException`
- `public java.util.List<java.lang.String> getTabCompletionOptions( MinecraftServer server, ICommandSender sender, java.lang.String[] args, @Nullable BlockPos pos)`
- `public boolean isUsernameIndex(java.lang.String[] args, int index)`
