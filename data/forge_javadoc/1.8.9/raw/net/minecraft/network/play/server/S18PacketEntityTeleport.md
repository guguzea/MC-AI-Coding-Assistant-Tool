---
title: "S18PacketEntityTeleport"
description: "Passes this Packet on to the NetHandler for processing."
package: "net/minecraft/network/play/server"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/play/server/S18PacketEntityTeleport.html"
sourceType: javadoc
---

# S18PacketEntityTeleport

## Class signature

```java
public class S18PacketEntityTeleport extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public S18PacketEntityTeleport()`
- `public S18PacketEntityTeleport( Entity entityIn)`
- `public S18PacketEntityTeleport(int entityIdIn, int posXIn, int posYIn, int posZIn, byte yawIn, byte pitchIn, boolean onGroundIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public int getEntityId()`
- `public int getX()`
- `public int getY()`
- `public int getZ()`
- `public byte getYaw()`
- `public byte getPitch()`
- `public boolean getOnGround()`

## Description

Passes this Packet on to the NetHandler for processing.
