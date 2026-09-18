---
title: "S21PacketChunkData"
description: "Passes this Packet on to the NetHandler for processing."
package: "net/minecraft/network/play/server"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/play/server/S21PacketChunkData.html"
sourceType: javadoc
---

# S21PacketChunkData

## Class signature

```java
public class S21PacketChunkData extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public S21PacketChunkData()`
- `public S21PacketChunkData( Chunk chunkIn, boolean p_i45196_2_, int p_i45196_3_)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public byte[] func_149272_d()`
- `protected static int func_180737_a(int p_180737_0_, boolean p_180737_1_, boolean p_180737_2_)`
- `public static S21PacketChunkData.Extracted func_179756_a( Chunk p_179756_0_, boolean p_179756_1_, boolean p_179756_2_, int p_179756_3_)`
- `public int getChunkX()`
- `public int getChunkZ()`
- `public int getExtractedSize()`
- `public boolean func_149274_i()`

## Description

Passes this Packet on to the NetHandler for processing.
