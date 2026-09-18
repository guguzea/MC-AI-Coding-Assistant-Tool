---
title: "S10PacketSpawnPainting"
description: "Passes this Packet on to the NetHandler for processing."
package: "net/minecraft/network/play/server"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/play/server/S10PacketSpawnPainting.html"
sourceType: javadoc
---

# S10PacketSpawnPainting

## Class signature

```java
public class S10PacketSpawnPainting extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public S10PacketSpawnPainting()`
- `public S10PacketSpawnPainting( EntityPainting painting)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public int getEntityID()`
- `public BlockPos getPosition()`
- `public EnumFacing getFacing()`
- `public java.lang.String getTitle()`

## Description

Passes this Packet on to the NetHandler for processing.
