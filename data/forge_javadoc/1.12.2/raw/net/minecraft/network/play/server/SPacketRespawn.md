---
title: "SPacketRespawn"
description: "public class SPacketRespawn extends java.lang.Object implements Packet<INetHandlerPlayClient>"
package: "net/minecraft/network/play/server"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/network/play/server/SPacketRespawn.html"
sourceType: javadoc
---

# SPacketRespawn

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketRespawn

## Class signature

```java
public class SPacketRespawn extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketRespawn()`
- `SPacketRespawn(int dimensionIdIn, EnumDifficulty difficultyIn, WorldType worldTypeIn, GameType gameModeIn)`

## Methods

- `EnumDifficulty getDifficulty()`
- `int getDimensionID()`
- `GameType getGameType()`
- `WorldType getWorldType()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`
