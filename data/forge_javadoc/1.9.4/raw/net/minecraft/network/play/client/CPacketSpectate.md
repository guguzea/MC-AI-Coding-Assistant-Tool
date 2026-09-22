---
title: "CPacketSpectate"
description: "public class CPacketSpectate extends java.lang.Object implements Packet<INetHandlerPlayServer>"
package: "net/minecraft/network/play/client"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/network/play/client/CPacketSpectate.html"
sourceType: javadoc
---

# CPacketSpectate

**Inheritance:** java.lang.Object → net.minecraft.network.play.client.CPacketSpectate

## Class signature

```java
public class CPacketSpectate extends java.lang.Object implements Packet<INetHandlerPlayServer>
```

## Constructors

- `CPacketSpectate()`
- `CPacketSpectate(java.util.UUID uniqueIdIn)`

## Methods

- `Entity getEntity(WorldServer worldIn)`
- `void processPacket(INetHandlerPlayServer handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`
