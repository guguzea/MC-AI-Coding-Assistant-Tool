---
title: "RConConsoleSource"
description: "public class RConConsoleSource extends java.lang.Object implements ICommandSender"
package: "net/minecraft/network/rcon"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/network/rcon/RConConsoleSource.html"
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
- `public void sendMessage( ITextComponent component)`
- `public boolean canUseCommand(int permLevel, java.lang.String commandName)`
- `public World getEntityWorld()`
- `public boolean sendCommandFeedback()`
- `public MinecraftServer getServer()`
- `public void resetLog()`
- `public java.lang.String getLogContents()`
