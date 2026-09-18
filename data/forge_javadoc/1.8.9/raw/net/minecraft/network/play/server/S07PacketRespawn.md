---
title: "S07PacketRespawn"
description: "Passes this Packet on to the NetHandler for processing."
package: "net/minecraft/network/play/server"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/play/server/S07PacketRespawn.html"
sourceType: javadoc
---

# S07PacketRespawn

## Class signature

```java
public class S07PacketRespawn extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public S07PacketRespawn()`
- `public S07PacketRespawn(int dimensionIDIn, EnumDifficulty difficultyIn, WorldType worldTypeIn, WorldSettings.GameType gameTypeIn)`

## Methods

- `public void processPacket( INetHandlerPlayClient handler)`
- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public int getDimensionID()`
- `public EnumDifficulty getDifficulty()`
- `public WorldSettings.GameType getGameType()`
- `public WorldType getWorldType()`

## Description

Passes this Packet on to the NetHandler for processing.
