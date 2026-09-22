---
title: "C02PacketUseEntity"
description: "public class C02PacketUseEntity extends java.lang.Object implements Packet<INetHandlerPlayServer>"
package: "net/minecraft/network/play/client"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/play/client/C02PacketUseEntity.html"
sourceType: javadoc
---

# C02PacketUseEntity

**Inheritance:** java.lang.Object → net.minecraft.network.play.client.C02PacketUseEntity

## Class signature

```java
public class C02PacketUseEntity extends java.lang.Object implements Packet<INetHandlerPlayServer>
```

## Constructors

- `C02PacketUseEntity()`
- `C02PacketUseEntity(Entity entity, C02PacketUseEntity.Action action)`
- `C02PacketUseEntity(Entity entity, Vec3 hitVec)`

## Methods

- `C02PacketUseEntity.Action getAction()`
- `Entity getEntityFromWorld(World worldIn)`
- `Vec3 getHitVec()`
- `void processPacket(INetHandlerPlayServer handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.
