---
title: "S18PacketEntityTeleport"
description: "public class S18PacketEntityTeleport extends java.lang.Object implements Packet<INetHandlerPlayClient>"
package: "net/minecraft/network/play/server"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/play/server/S18PacketEntityTeleport.html"
sourceType: javadoc
---

# S18PacketEntityTeleport

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.S18PacketEntityTeleport

## Class signature

```java
public class S18PacketEntityTeleport extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `S18PacketEntityTeleport()`
- `S18PacketEntityTeleport(Entity entityIn)`
- `S18PacketEntityTeleport(int entityIdIn, int posXIn, int posYIn, int posZIn, byte yawIn, byte pitchIn, boolean onGroundIn)`

## Methods

- `int getEntityId()`
- `boolean getOnGround()`
- `byte getPitch()`
- `int getX()`
- `int getY()`
- `byte getYaw()`
- `int getZ()`
- `void processPacket(INetHandlerPlayClient handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.
