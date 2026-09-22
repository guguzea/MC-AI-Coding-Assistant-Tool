---
title: "CommandMessage"
description: "public class CommandMessage extends CommandBase"
package: "net/minecraft/command/server"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/command/server/CommandMessage.html"
sourceType: javadoc
---

# CommandMessage

**Inheritance:** java.lang.Object → net.minecraft.command.CommandBase → net.minecraft.command.server.CommandMessage

## Class signature

```java
public class CommandMessage extends CommandBase
```

## Constructors

- `CommandMessage()`

## Methods

- `void execute(MinecraftServer server, ICommandSender sender, java.lang.String[] args)`
- `java.util.List<java.lang.String> getAliases()`
- `java.lang.String getName()`
- `int getRequiredPermissionLevel()`
- `java.util.List<java.lang.String> getTabCompletions(MinecraftServer server, ICommandSender sender, java.lang.String[] args, BlockPos targetPos)`
- `java.lang.String getUsage(ICommandSender sender)`
- `boolean isUsernameIndex(java.lang.String[] args, int index)`
