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