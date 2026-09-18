# S23PacketBlockChange

## Class signature

```java
public class S23PacketBlockChange extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public S23PacketBlockChange()`
- `public S23PacketBlockChange( World worldIn, BlockPos blockPositionIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public IBlockState getBlockState()`
- `public BlockPos getBlockPosition()`

## Description

Passes this Packet on to the NetHandler for processing.