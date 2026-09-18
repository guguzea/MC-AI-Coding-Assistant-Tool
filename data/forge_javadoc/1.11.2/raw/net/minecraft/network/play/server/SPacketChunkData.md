---
title: "SPacketChunkData"
description: "public class SPacketChunkData extends java.lang.Object implements Packet < INetHandlerPlayClient >"
package: "net/minecraft/network/play/server"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/network/play/server/SPacketChunkData.html"
sourceType: javadoc
---

# SPacketChunkData

## Class signature

```java
public class SPacketChunkData extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketChunkData()`
- `public SPacketChunkData( Chunk p_i47124_1_, int p_i47124_2_)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public PacketBuffer getReadBuffer()`
- `public int extractChunkData( PacketBuffer p_189555_1_, Chunk p_189555_2_, boolean p_189555_3_, int p_189555_4_)`
- `protected int calculateChunkSize( Chunk chunkIn, boolean p_189556_2_, int p_189556_3_)`
- `public int getChunkX()`
- `public int getChunkZ()`
- `public int getExtractedSize()`
- `public boolean doChunkLoad()`
- `public java.util.List< NBTTagCompound > getTileEntityTags()`
