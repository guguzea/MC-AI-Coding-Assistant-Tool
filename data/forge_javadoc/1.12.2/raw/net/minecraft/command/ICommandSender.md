---
title: "ICommandSender"
description: "public interface ICommandSender"
package: "net/minecraft/command"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/command/ICommandSender.html"
sourceType: javadoc
---

# ICommandSender

## Class signature

```java
public interface ICommandSender
```

## Methods

- `boolean canUseCommand(int permLevel, java.lang.String commandName)`
- `default Entity getCommandSenderEntity()`
- `default ITextComponent getDisplayName()`
- `World getEntityWorld()`
- `java.lang.String getName()`
- `default BlockPos getPosition()`
- `default Vec3d getPositionVector()`
- `MinecraftServer getServer()`
- `default boolean sendCommandFeedback()`
- `default void sendMessage(ITextComponent component)`
- `default void setCommandStat(CommandResultStats.Type type, int amount)`
