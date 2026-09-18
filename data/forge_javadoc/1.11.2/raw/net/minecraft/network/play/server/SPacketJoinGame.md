---
title: "SPacketJoinGame"
description: "public class SPacketJoinGame extends java.lang.Object implements Packet < INetHandlerPlayClient >"
package: "net/minecraft/network/play/server"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/network/play/server/SPacketJoinGame.html"
sourceType: javadoc
---

# SPacketJoinGame

## Class signature

```java
public class SPacketJoinGame extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketJoinGame()`
- `public SPacketJoinGame(int playerIdIn, GameType gameTypeIn, boolean hardcoreModeIn, int dimensionIn, EnumDifficulty difficultyIn, int maxPlayersIn, WorldType worldTypeIn, boolean reducedDebugInfoIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public int getPlayerId()`
- `public boolean isHardcoreMode()`
- `public GameType getGameType()`
- `public int getDimension()`
- `public EnumDifficulty getDifficulty()`
- `public int getMaxPlayers()`
- `public WorldType getWorldType()`
- `public boolean isReducedDebugInfo()`
