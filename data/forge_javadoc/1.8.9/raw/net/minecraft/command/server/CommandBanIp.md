---
title: "CommandBanIp"
description: "public class CommandBanIp extends CommandBase"
package: "net/minecraft/command/server"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/command/server/CommandBanIp.html"
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

- `java.util.List<java.lang.String> addTabCompletionOptions(ICommandSender sender, java.lang.String[] args, BlockPos pos)`
- `boolean canCommandSenderUseCommand(ICommandSender sender)` — Returns true if the given command sender is allowed to use this command.
- `protected void func_147210_a(ICommandSender p_147210_1_, java.lang.String p_147210_2_, java.lang.String p_147210_3_)`
- `java.lang.String getCommandName()` — Gets the name of the command
- `java.lang.String getCommandUsage(ICommandSender sender)` — Gets the usage string for the command.
- `int getRequiredPermissionLevel()` — Return the required permission level for this command.
- `void processCommand(ICommandSender sender, java.lang.String[] args)` — Callback when the command is invoked

## Fields

- `static java.util.regex.Pattern field_147211_a`
