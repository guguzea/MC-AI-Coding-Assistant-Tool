---
title: "ICommandSender"
description: "public interface ICommandSender"
package: "net/minecraft/command"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/command/ICommandSender.html"
sourceType: javadoc
---

# ICommandSender

## Class signature

```java
public interface ICommandSender
```

## Methods

- `java.lang.String getName()`
- `default ITextComponent getDisplayName()`
- `default void sendMessage( ITextComponent component)`
- `boolean canUseCommand(int permLevel, java.lang.String commandName)`
- `default BlockPos getPosition()`
- `default Vec3d getPositionVector()`
- `World getEntityWorld()`
- `default Entity getCommandSenderEntity()`
- `default boolean sendCommandFeedback()`
- `default void setCommandStat( CommandResultStats.Type type, int amount)`
- `MinecraftServer getServer()`
