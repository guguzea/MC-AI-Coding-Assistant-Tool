---
title: "SPacketSpawnPosition"
description: "public class SPacketSpawnPosition extends java.lang.Object implements Packet<INetHandlerPlayClient>"
package: "net/minecraft/network/play/server"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/network/play/server/SPacketSpawnPosition.html"
sourceType: javadoc
---

# SPacketSpawnPosition

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketSpawnPosition

## Class signature

```java
public class SPacketSpawnPosition extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketSpawnPosition()`
- `SPacketSpawnPosition(BlockPos posIn)`

## Methods

- `BlockPos getSpawnPos()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`
