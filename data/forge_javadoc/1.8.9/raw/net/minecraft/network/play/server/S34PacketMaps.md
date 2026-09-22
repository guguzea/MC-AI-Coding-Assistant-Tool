---
title: "S34PacketMaps"
description: "public class S34PacketMaps extends java.lang.Object implements Packet<INetHandlerPlayClient>"
package: "net/minecraft/network/play/server"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/play/server/S34PacketMaps.html"
sourceType: javadoc
---

# S34PacketMaps

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.S34PacketMaps

## Class signature

```java
public class S34PacketMaps extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `S34PacketMaps()`
- `S34PacketMaps(int mapIdIn, byte scale, java.util.Collection<Vec4b> visiblePlayers, byte[] colors, int minX, int minY, int maxX, int maxY)`

## Methods

- `int getMapId()`
- `void processPacket(INetHandlerPlayClient handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void setMapdataTo(MapData mapdataIn)` — Sets new MapData from the packet to given MapData param
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.
