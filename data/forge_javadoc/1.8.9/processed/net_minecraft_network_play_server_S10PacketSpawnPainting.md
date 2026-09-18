# S10PacketSpawnPainting

## Class signature

```java
public class S10PacketSpawnPainting extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public S10PacketSpawnPainting()`
- `public S10PacketSpawnPainting( EntityPainting painting)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public int getEntityID()`
- `public BlockPos getPosition()`
- `public EnumFacing getFacing()`
- `public java.lang.String getTitle()`

## Description

Passes this Packet on to the NetHandler for processing.