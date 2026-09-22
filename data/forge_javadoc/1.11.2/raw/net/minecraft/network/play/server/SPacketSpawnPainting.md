---
title: "SPacketSpawnPainting"
description: "public class SPacketSpawnPainting extends java.lang.Object implements Packet<INetHandlerPlayClient>"
package: "net/minecraft/network/play/server"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/network/play/server/SPacketSpawnPainting.html"
sourceType: javadoc
---

# SPacketSpawnPainting

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketSpawnPainting

## Class signature

```java
public class SPacketSpawnPainting extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketSpawnPainting()`
- `SPacketSpawnPainting(EntityPainting painting)`

## Methods

- `int getEntityID()`
- `EnumFacing getFacing()`
- `BlockPos getPosition()`
- `java.lang.String getTitle()`
- `java.util.UUID getUniqueId()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`
