---
title: "ICommandSender"
description: "public interface ICommandSender"
package: "net/minecraft/command"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/command/ICommandSender.html"
sourceType: javadoc
---

# ICommandSender

## Class signature

```java
public interface ICommandSender
```

## Methods

- `java.lang.String getName()`
- `ITextComponent getDisplayName()`
- `void addChatMessage( ITextComponent component)`
- `boolean canCommandSenderUseCommand(int permLevel, java.lang.String commandName)`
- `BlockPos getPosition()`
- `Vec3d getPositionVector()`
- `World getEntityWorld()`
- `@Nullable Entity getCommandSenderEntity()`
- `boolean sendCommandFeedback()`
- `void setCommandStat( CommandResultStats.Type type, int amount)`
- `@Nullable MinecraftServer getServer()`
