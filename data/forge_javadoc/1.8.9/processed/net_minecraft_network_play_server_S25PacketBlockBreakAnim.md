# S25PacketBlockBreakAnim

## Class signature

```java
public class S25PacketBlockBreakAnim extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public S25PacketBlockBreakAnim()`
- `public S25PacketBlockBreakAnim(int breakerId, BlockPos pos, int progress)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public int getBreakerId()`
- `public BlockPos getPosition()`
- `public int getProgress()`

## Description

Passes this Packet on to the NetHandler for processing.