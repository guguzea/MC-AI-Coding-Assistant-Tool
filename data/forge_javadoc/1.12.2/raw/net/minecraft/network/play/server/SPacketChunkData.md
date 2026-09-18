---
title: "SPacketChunkData"
description: "public class SPacketChunkData extends java.lang.Object implements Packet < INetHandlerPlayClient >"
package: "net/minecraft/network/play/server"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/network/play/server/SPacketChunkData.html"
sourceType: javadoc
---

# SPacketChunkData

## Class signature

```java
public class SPacketChunkData extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketChunkData()`
- `public SPacketChunkData( Chunk chunkIn, int changedSectionFilter)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public PacketBuffer getReadBuffer()`
- `public int extractChunkData( PacketBuffer buf, Chunk chunkIn, boolean writeSkylight, int changedSectionFilter)`
- `protected int calculateChunkSize( Chunk chunkIn, boolean p_189556_2_, int p_189556_3_)`
- `public int getChunkX()`
- `public int getChunkZ()`
- `public int getExtractedSize()`
- `public boolean isFullChunk()`
- `public java.util.List< NBTTagCompound > getTileEntityTags()`
