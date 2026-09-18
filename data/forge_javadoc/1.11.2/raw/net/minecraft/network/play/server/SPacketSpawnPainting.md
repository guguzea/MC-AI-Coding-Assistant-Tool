---
title: "SPacketSpawnPainting"
description: "public class SPacketSpawnPainting extends java.lang.Object implements Packet < INetHandlerPlayClient >"
package: "net/minecraft/network/play/server"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/network/play/server/SPacketSpawnPainting.html"
sourceType: javadoc
---

# SPacketSpawnPainting

## Class signature

```java
public class SPacketSpawnPainting extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketSpawnPainting()`
- `public SPacketSpawnPainting( EntityPainting painting)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public int getEntityID()`
- `public java.util.UUID getUniqueId()`
- `public BlockPos getPosition()`
- `public EnumFacing getFacing()`
- `public java.lang.String getTitle()`
