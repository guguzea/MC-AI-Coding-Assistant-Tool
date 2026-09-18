---
title: "S19PacketEntityStatus"
description: "Passes this Packet on to the NetHandler for processing."
package: "net/minecraft/network/play/server"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/play/server/S19PacketEntityStatus.html"
sourceType: javadoc
---

# S19PacketEntityStatus

## Class signature

```java
public class S19PacketEntityStatus extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public S19PacketEntityStatus()`
- `public S19PacketEntityStatus( Entity entityIn, byte opCodeIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public Entity getEntity( World worldIn)`
- `public byte getOpCode()`

## Description

Passes this Packet on to the NetHandler for processing.
