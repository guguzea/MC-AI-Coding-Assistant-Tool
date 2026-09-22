---
title: "CPacketVehicleMove"
description: "public class CPacketVehicleMove extends java.lang.Object implements Packet<INetHandlerPlayServer>"
package: "net/minecraft/network/play/client"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/network/play/client/CPacketVehicleMove.html"
sourceType: javadoc
---

# CPacketVehicleMove

**Inheritance:** java.lang.Object → net.minecraft.network.play.client.CPacketVehicleMove

## Class signature

```java
public class CPacketVehicleMove extends java.lang.Object implements Packet<INetHandlerPlayServer>
```

## Constructors

- `CPacketVehicleMove()`
- `CPacketVehicleMove(Entity entityIn)`

## Methods

- `float getPitch()`
- `double getX()`
- `double getY()`
- `float getYaw()`
- `double getZ()`
- `void processPacket(INetHandlerPlayServer handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`
