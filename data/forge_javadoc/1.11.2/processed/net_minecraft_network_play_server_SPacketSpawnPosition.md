# SPacketSpawnPosition

## Class signature

```java
public class SPacketSpawnPosition extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketSpawnPosition()`
- `public SPacketSpawnPosition( BlockPos posIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public BlockPos getSpawnPos()`