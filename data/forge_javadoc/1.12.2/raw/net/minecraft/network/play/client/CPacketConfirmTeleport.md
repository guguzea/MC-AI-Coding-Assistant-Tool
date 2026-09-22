---
title: "CPacketConfirmTeleport"
description: "public class CPacketConfirmTeleport extends java.lang.Object implements Packet<INetHandlerPlayServer>"
package: "net/minecraft/network/play/client"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/network/play/client/CPacketConfirmTeleport.html"
sourceType: javadoc
---

# CPacketConfirmTeleport

**Inheritance:** java.lang.Object → net.minecraft.network.play.client.CPacketConfirmTeleport

## Class signature

```java
public class CPacketConfirmTeleport extends java.lang.Object implements Packet<INetHandlerPlayServer>
```

## Constructors

- `CPacketConfirmTeleport()`
- `CPacketConfirmTeleport(int teleportIdIn)`

## Methods

- `int getTeleportId()`
- `void processPacket(INetHandlerPlayServer handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`
