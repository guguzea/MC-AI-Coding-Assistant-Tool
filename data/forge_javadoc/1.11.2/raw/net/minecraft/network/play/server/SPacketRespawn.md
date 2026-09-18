---
title: "SPacketRespawn"
description: "public class SPacketRespawn extends java.lang.Object implements Packet < INetHandlerPlayClient >"
package: "net/minecraft/network/play/server"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/network/play/server/SPacketRespawn.html"
sourceType: javadoc
---

# SPacketRespawn

## Class signature

```java
public class SPacketRespawn extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketRespawn()`
- `public SPacketRespawn(int dimensionIdIn, EnumDifficulty difficultyIn, WorldType worldTypeIn, GameType gameModeIn)`

## Methods

- `public void processPacket( INetHandlerPlayClient handler)`
- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public int getDimensionID()`
- `public EnumDifficulty getDifficulty()`
- `public GameType getGameType()`
- `public WorldType getWorldType()`
