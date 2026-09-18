---
title: "S19PacketEntityHeadLook"
description: "Passes this Packet on to the NetHandler for processing."
package: "net/minecraft/network/play/server"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/play/server/S19PacketEntityHeadLook.html"
sourceType: javadoc
---

# S19PacketEntityHeadLook

## Class signature

```java
public class S19PacketEntityHeadLook extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public S19PacketEntityHeadLook()`
- `public S19PacketEntityHeadLook( Entity entityIn, byte p_i45214_2_)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public Entity getEntity( World worldIn)`
- `public byte getYaw()`

## Description

Passes this Packet on to the NetHandler for processing.
