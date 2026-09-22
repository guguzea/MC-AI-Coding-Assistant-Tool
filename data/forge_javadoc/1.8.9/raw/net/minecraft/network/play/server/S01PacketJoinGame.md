---
title: "S01PacketJoinGame"
description: "public class S01PacketJoinGame extends java.lang.Object implements Packet<INetHandlerPlayClient>"
package: "net/minecraft/network/play/server"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/play/server/S01PacketJoinGame.html"
sourceType: javadoc
---

# S01PacketJoinGame

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.S01PacketJoinGame

## Class signature

```java
public class S01PacketJoinGame extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `S01PacketJoinGame()`
- `S01PacketJoinGame(int entityIdIn, WorldSettings.GameType gameTypeIn, boolean hardcoreModeIn, int dimensionIn, EnumDifficulty difficultyIn, int maxPlayersIn, WorldType worldTypeIn, boolean reducedDebugInfoIn)`

## Methods

- `EnumDifficulty getDifficulty()`
- `int getDimension()`
- `int getEntityId()`
- `WorldSettings.GameType getGameType()`
- `int getMaxPlayers()`
- `WorldType getWorldType()`
- `boolean isHardcoreMode()`
- `boolean isReducedDebugInfo()`
- `void processPacket(INetHandlerPlayClient handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.
