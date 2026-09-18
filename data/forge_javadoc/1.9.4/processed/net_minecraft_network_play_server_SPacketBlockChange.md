# SPacketBlockChange

## Class signature

```java
public class SPacketBlockChange extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketBlockChange()`
- `public SPacketBlockChange( World worldIn, BlockPos posIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public IBlockState getBlockState()`
- `public BlockPos getBlockPosition()`