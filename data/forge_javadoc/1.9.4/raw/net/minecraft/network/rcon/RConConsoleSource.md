---
title: "RConConsoleSource"
description: "public class RConConsoleSource extends java.lang.Object implements ICommandSender"
package: "net/minecraft/network/rcon"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/network/rcon/RConConsoleSource.html"
sourceType: javadoc
---

# RConConsoleSource

**Inheritance:** java.lang.Object → net.minecraft.network.rcon.RConConsoleSource

## Class signature

```java
public class RConConsoleSource extends java.lang.Object implements ICommandSender
```

## Constructors

- `RConConsoleSource(MinecraftServer serverIn)`

## Methods

- `void addChatMessage(ITextComponent component)`
- `boolean canCommandSenderUseCommand(int permLevel, java.lang.String commandName)`
- `Entity getCommandSenderEntity()`
- `ITextComponent getDisplayName()`
- `World getEntityWorld()`
- `java.lang.String getLogContents()`
- `java.lang.String getName()`
- `BlockPos getPosition()`
- `Vec3d getPositionVector()`
- `MinecraftServer getServer()`
- `void resetLog()`
- `boolean sendCommandFeedback()`
- `void setCommandStat(CommandResultStats.Type type, int amount)`
