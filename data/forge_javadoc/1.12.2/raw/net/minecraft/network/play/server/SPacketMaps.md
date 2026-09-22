---
title: "SPacketMaps"
description: "public class SPacketMaps extends java.lang.Object implements Packet<INetHandlerPlayClient>"
package: "net/minecraft/network/play/server"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/network/play/server/SPacketMaps.html"
sourceType: javadoc
---

# SPacketMaps

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketMaps

## Class signature

```java
public class SPacketMaps extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketMaps()`
- `SPacketMaps(int mapIdIn, byte mapScaleIn, boolean trackingPositionIn, java.util.Collection<MapDecoration> iconsIn, byte[] p_i46937_5_, int minXIn, int minZIn, int columnsIn, int rowsIn)`

## Methods

- `int getMapId()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void setMapdataTo(MapData mapdataIn)`
- `void writePacketData(PacketBuffer buf)`
