---
title: "CommandAchievement"
description: "public class CommandAchievement extends CommandBase"
package: "net/minecraft/command/server"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/command/server/CommandAchievement.html"
sourceType: javadoc
---

# CommandAchievement

## Class signature

```java
public class CommandAchievement extends CommandBase
```

## Constructors

- `public CommandAchievement()`

## Methods

- `public java.lang.String getCommandName()`
- `public int getRequiredPermissionLevel()`
- `public java.lang.String getCommandUsage( ICommandSender sender)`
- `public void execute( MinecraftServer server, ICommandSender sender, java.lang.String[] args) throws CommandException`
- `public java.util.List<java.lang.String> getTabCompletionOptions( MinecraftServer server, ICommandSender sender, java.lang.String[] args, @Nullable BlockPos pos)`
- `public boolean isUsernameIndex(java.lang.String[] args, int index)`
