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