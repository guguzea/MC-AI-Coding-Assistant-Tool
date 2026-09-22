---
title: "SPacketJoinGame"
description: "public class SPacketJoinGame extends java.lang.Object implements Packet<INetHandlerPlayClient>"
package: "net/minecraft/network/play/server"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/network/play/server/SPacketJoinGame.html"
sourceType: javadoc
---

# SPacketJoinGame

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketJoinGame

## Class signature

```java
public class SPacketJoinGame extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketJoinGame()`
- `SPacketJoinGame(int playerIdIn, WorldSettings.GameType gameTypeIn, boolean hardcoreModeIn, int dimensionIn, EnumDifficulty difficultyIn, int maxPlayersIn, WorldType worldTypeIn, boolean reducedDebugInfoIn)`

## Methods

- `EnumDifficulty getDifficulty()`
- `int getDimension()`
- `WorldSettings.GameType getGameType()`
- `int getMaxPlayers()`
- `int getPlayerId()`
- `WorldType getWorldType()`
- `boolean isHardcoreMode()`
- `boolean isReducedDebugInfo()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`
