---
title: "S13PacketDestroyEntities"
description: "Passes this Packet on to the NetHandler for processing."
package: "net/minecraft/network/play/server"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/play/server/S13PacketDestroyEntities.html"
sourceType: javadoc
---

# S13PacketDestroyEntities

## Class signature

```java
public class S13PacketDestroyEntities extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public S13PacketDestroyEntities()`
- `public S13PacketDestroyEntities(int... entityIDsIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public int[] getEntityIDs()`

## Description

Passes this Packet on to the NetHandler for processing.
