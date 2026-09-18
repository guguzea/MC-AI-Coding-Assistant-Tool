# SPacketMultiBlockChange

## Class signature

```java
public class SPacketMultiBlockChange extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketMultiBlockChange()`
- `public SPacketMultiBlockChange(int p_i46959_1_, short[] p_i46959_2_, Chunk p_i46959_3_)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public SPacketMultiBlockChange.BlockUpdateData [] getChangedBlocks()`