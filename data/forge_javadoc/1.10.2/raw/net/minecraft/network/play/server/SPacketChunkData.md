---
title: "SPacketChunkData"
description: "public class SPacketChunkData extends java.lang.Object implements Packet<INetHandlerPlayClient>"
package: "net/minecraft/network/play/server"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/network/play/server/SPacketChunkData.html"
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
- `SPacketChunkData(Chunk p_i47124_1_, int p_i47124_2_)`

## Methods

- `protected int calculateChunkSize(Chunk chunkIn, boolean p_189556_2_, int p_189556_3_)`
- `boolean doChunkLoad()`
- `int extractChunkData(PacketBuffer p_189555_1_, Chunk p_189555_2_, boolean p_189555_3_, int p_189555_4_)`
- `int getChunkX()`
- `int getChunkZ()`
- `int getExtractedSize()`
- `PacketBuffer getReadBuffer()`
- `java.util.List<NBTTagCompound> getTileEntityTags()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`
