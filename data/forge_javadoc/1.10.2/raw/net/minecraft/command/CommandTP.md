---
title: "CommandTP"
description: "public class CommandTP extends CommandBase"
package: "net/minecraft/command"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/command/CommandTP.html"
sourceType: javadoc
---

# CommandTP

## Class signature

```java
public class CommandTP extends CommandBase
```

## Constructors

- `public CommandTP()`

## Methods

- `public java.lang.String getCommandName()`
- `public int getRequiredPermissionLevel()`
- `public java.lang.String getCommandUsage( ICommandSender sender)`
- `public void execute( MinecraftServer server, ICommandSender sender, java.lang.String[] args) throws CommandException`
- `public java.util.List<java.lang.String> getTabCompletionOptions( MinecraftServer server, ICommandSender sender, java.lang.String[] args, @Nullable BlockPos pos)`
- `public boolean isUsernameIndex(java.lang.String[] args, int index)`
