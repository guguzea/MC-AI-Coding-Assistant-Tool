---
title: "SPacketEntityTeleport"
description: "public class SPacketEntityTeleport extends java.lang.Object implements Packet < INetHandlerPlayClient >"
package: "net/minecraft/network/play/server"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/network/play/server/SPacketEntityTeleport.html"
sourceType: javadoc
---

# SPacketEntityTeleport

## Class signature

```java
public class SPacketEntityTeleport extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketEntityTeleport()`
- `public SPacketEntityTeleport( Entity entityIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public int getEntityId()`
- `public double getX()`
- `public double getY()`
- `public double getZ()`
- `public byte getYaw()`
- `public byte getPitch()`
- `public boolean getOnGround()`
