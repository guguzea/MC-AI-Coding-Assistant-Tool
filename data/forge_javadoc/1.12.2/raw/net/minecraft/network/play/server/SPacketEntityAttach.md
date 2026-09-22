---
title: "SPacketEntityAttach"
description: "public class SPacketEntityAttach extends java.lang.Object implements Packet<INetHandlerPlayClient>"
package: "net/minecraft/network/play/server"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/network/play/server/SPacketEntityAttach.html"
sourceType: javadoc
---

# SPacketEntityAttach

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketEntityAttach

## Class signature

```java
public class SPacketEntityAttach extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketEntityAttach()`
- `SPacketEntityAttach(Entity entityIn, Entity vehicleIn)`

## Methods

- `int getEntityId()`
- `int getVehicleEntityId()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`
