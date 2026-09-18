---
title: "S01PacketJoinGame"
description: "Passes this Packet on to the NetHandler for processing."
package: "net/minecraft/network/play/server"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/play/server/S01PacketJoinGame.html"
sourceType: javadoc
---

# S01PacketJoinGame

## Class signature

```java
public class S01PacketJoinGame extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public S01PacketJoinGame()`
- `public S01PacketJoinGame(int entityIdIn, WorldSettings.GameType gameTypeIn, boolean hardcoreModeIn, int dimensionIn, EnumDifficulty difficultyIn, int maxPlayersIn, WorldType worldTypeIn, boolean reducedDebugInfoIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public int getEntityId()`
- `public boolean isHardcoreMode()`
- `public WorldSettings.GameType getGameType()`
- `public int getDimension()`
- `public EnumDifficulty getDifficulty()`
- `public int getMaxPlayers()`
- `public WorldType getWorldType()`
- `public boolean isReducedDebugInfo()`

## Description

Passes this Packet on to the NetHandler for processing.
