---
title: "SPacketChunkData"
description: "public class SPacketChunkData extends java.lang.Object implements Packet<INetHandlerPlayClient>"
package: "net/minecraft/network/play/server"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/network/play/server/SPacketChunkData.html"
sourceType: javadoc
---

# SPacketChunkData

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketChunkData

## Class signature

```java
public class SPacketChunkData extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketChunkData()`
- `SPacketChunkData(Chunk chunkIn, int changedSectionFilter)`

## Methods

- `protected int calculateChunkSize(Chunk chunkIn, boolean p_189556_2_, int p_189556_3_)`
- `int extractChunkData(PacketBuffer buf, Chunk chunkIn, boolean writeSkylight, int changedSectionFilter)`
- `int getChunkX()`
- `int getChunkZ()`
- `int getExtractedSize()`
- `PacketBuffer getReadBuffer()`
- `java.util.List<NBTTagCompound> getTileEntityTags()`
- `boolean isFullChunk()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`
