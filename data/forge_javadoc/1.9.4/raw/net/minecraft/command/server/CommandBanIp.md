---
title: "CommandBanIp"
description: "public class CommandBanIp extends CommandBase"
package: "net/minecraft/command/server"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/command/server/CommandBanIp.html"
sourceType: javadoc
---

# CommandBanIp

## Class signature

```java
public class CommandBanIp extends CommandBase
```

## Constructors

- `public CommandBanIp()`

## Methods

- `public java.lang.String getCommandName()`
- `public int getRequiredPermissionLevel()`
- `public boolean checkPermission( MinecraftServer server, ICommandSender sender)`
- `public java.lang.String getCommandUsage( ICommandSender sender)`
- `public void execute( MinecraftServer server, ICommandSender sender, java.lang.String[] args) throws CommandException`
- `public java.util.List<java.lang.String> getTabCompletionOptions( MinecraftServer server, ICommandSender sender, java.lang.String[] args, @Nullable BlockPos pos)`
- `protected void banIp( MinecraftServer server, ICommandSender sender, java.lang.String ipAddress, @Nullable java.lang.String banReason)`
