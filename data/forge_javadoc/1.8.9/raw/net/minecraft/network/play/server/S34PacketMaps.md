---
title: "S34PacketMaps"
description: "Passes this Packet on to the NetHandler for processing."
package: "net/minecraft/network/play/server"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/play/server/S34PacketMaps.html"
sourceType: javadoc
---

# S34PacketMaps

## Class signature

```java
public class S34PacketMaps extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public S34PacketMaps()`
- `public S34PacketMaps(int mapIdIn, byte scale, java.util.Collection< Vec4b > visiblePlayers, byte[] colors, int minX, int minY, int maxX, int maxY)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public int getMapId()`
- `public void setMapdataTo( MapData mapdataIn)`

## Description

Passes this Packet on to the NetHandler for processing.
