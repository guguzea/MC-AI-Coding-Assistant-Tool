---
title: "ICommandSender"
description: "public interface ICommandSender"
package: "net/minecraft/command"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/command/ICommandSender.html"
sourceType: javadoc
---

# ICommandSender

## Class signature

```java
public interface ICommandSender
```

## Methods

- `boolean canUseCommand(int permLevel, java.lang.String commandName)`
- `Entity getCommandSenderEntity()`
- `ITextComponent getDisplayName()`
- `World getEntityWorld()`
- `java.lang.String getName()`
- `BlockPos getPosition()`
- `Vec3d getPositionVector()`
- `MinecraftServer getServer()`
- `boolean sendCommandFeedback()`
- `void sendMessage(ITextComponent component)`
- `void setCommandStat(CommandResultStats.Type type, int amount)`
