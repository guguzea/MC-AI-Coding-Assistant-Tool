---
title: "RConConsoleSource"
description: "public class RConConsoleSource extends java.lang.Object implements ICommandSender"
package: "net/minecraft/network/rcon"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/network/rcon/RConConsoleSource.html"
sourceType: javadoc
---

# RConConsoleSource

## Class signature

```java
public class RConConsoleSource extends java.lang.Object implements ICommandSender
```

## Constructors

- `public RConConsoleSource( MinecraftServer serverIn)`

## Methods

- `public java.lang.String getName()`
- `public ITextComponent getDisplayName()`
- `public void addChatMessage( ITextComponent component)`
- `public boolean canCommandSenderUseCommand(int permLevel, java.lang.String commandName)`
- `public BlockPos getPosition()`
- `public Vec3d getPositionVector()`
- `public World getEntityWorld()`
- `public Entity getCommandSenderEntity()`
- `public boolean sendCommandFeedback()`
- `public void setCommandStat( CommandResultStats.Type type, int amount)`
- `public MinecraftServer getServer()`
- `public void resetLog()`
- `public java.lang.String getLogContents()`
