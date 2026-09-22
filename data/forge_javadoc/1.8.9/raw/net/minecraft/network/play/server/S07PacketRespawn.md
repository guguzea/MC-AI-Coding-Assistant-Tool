---
title: "S07PacketRespawn"
description: "public class S07PacketRespawn extends java.lang.Object implements Packet<INetHandlerPlayClient>"
package: "net/minecraft/network/play/server"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/play/server/S07PacketRespawn.html"
sourceType: javadoc
---

# S07PacketRespawn

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.S07PacketRespawn

## Class signature

```java
public class S07PacketRespawn extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `S07PacketRespawn()`
- `S07PacketRespawn(int dimensionIDIn, EnumDifficulty difficultyIn, WorldType worldTypeIn, WorldSettings.GameType gameTypeIn)`

## Methods

- `EnumDifficulty getDifficulty()`
- `int getDimensionID()`
- `WorldSettings.GameType getGameType()`
- `WorldType getWorldType()`
- `void processPacket(INetHandlerPlayClient handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.
