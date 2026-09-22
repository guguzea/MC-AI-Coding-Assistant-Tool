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