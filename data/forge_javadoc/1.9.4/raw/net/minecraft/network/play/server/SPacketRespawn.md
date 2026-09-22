---
title: "SPacketRespawn"
description: "public class SPacketRespawn extends java.lang.Object implements Packet<INetHandlerPlayClient>"
package: "net/minecraft/network/play/server"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/network/play/server/SPacketRespawn.html"
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
- `SPacketRespawn(int dimensionIdIn, EnumDifficulty difficultyIn, WorldType worldTypeIn, WorldSettings.GameType gameModeIn)`

## Methods

- `EnumDifficulty getDifficulty()`
- `int getDimensionID()`
- `WorldSettings.GameType getGameType()`
- `WorldType getWorldType()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`
