---
title: "CommandBanIp"
description: "public class CommandBanIp extends CommandBase"
package: "net/minecraft/command/server"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/command/server/CommandBanIp.html"
sourceType: javadoc
---

# CommandBanIp

**Inheritance:** java.lang.Object → net.minecraft.command.CommandBase → net.minecraft.command.server.CommandBanIp

## Class signature

```java
public class CommandBanIp extends CommandBase
```

## Constructors

- `CommandBanIp()`

## Methods

- `protected void banIp(MinecraftServer server, ICommandSender sender, java.lang.String ipAddress, java.lang.String banReason)`
- `boolean checkPermission(MinecraftServer server, ICommandSender sender)`
- `void execute(MinecraftServer server, ICommandSender sender, java.lang.String[] args)`
- `java.lang.String getCommandName()`
- `java.lang.String getCommandUsage(ICommandSender sender)`
- `int getRequiredPermissionLevel()`
- `java.util.List<java.lang.String> getTabCompletionOptions(MinecraftServer server, ICommandSender sender, java.lang.String[] args, BlockPos pos)`

## Fields

- `static java.util.regex.Pattern IP_PATTERN`
