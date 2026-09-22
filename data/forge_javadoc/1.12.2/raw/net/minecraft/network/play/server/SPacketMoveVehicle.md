---
title: "SPacketMoveVehicle"
description: "public class SPacketMoveVehicle extends java.lang.Object implements Packet<INetHandlerPlayClient>"
package: "net/minecraft/network/play/server"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/network/play/server/SPacketMoveVehicle.html"
sourceType: javadoc
---

# SPacketMoveVehicle

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketMoveVehicle

## Class signature

```java
public class SPacketMoveVehicle extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketMoveVehicle()`
- `SPacketMoveVehicle(Entity entityIn)`

## Methods

- `float getPitch()`
- `double getX()`
- `double getY()`
- `float getYaw()`
- `double getZ()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`
