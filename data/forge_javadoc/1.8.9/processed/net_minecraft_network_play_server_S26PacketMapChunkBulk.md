# S26PacketMapChunkBulk

## Class signature

```java
public class S26PacketMapChunkBulk extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public S26PacketMapChunkBulk()`
- `public S26PacketMapChunkBulk(java.util.List< Chunk > chunks)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public int getChunkX(int p_149255_1_)`
- `public int getChunkZ(int p_149253_1_)`
- `public int getChunkCount()`
- `public byte[] getChunkBytes(int p_149256_1_)`
- `public int getChunkSize(int p_179754_1_)`

## Description

Passes this Packet on to the NetHandler for processing.