---
title: "SPacketDestroyEntities"
description: "public class SPacketDestroyEntities extends java.lang.Object implements Packet < INetHandlerPlayClient >"
package: "net/minecraft/network/play/server"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/network/play/server/SPacketDestroyEntities.html"
sourceType: javadoc
---

# SPacketDestroyEntities

## Class signature

```java
public class SPacketDestroyEntities extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketDestroyEntities()`
- `public SPacketDestroyEntities(int... entityIdsIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public int[] getEntityIDs()`
