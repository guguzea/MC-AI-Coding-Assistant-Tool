# SPacketBlockBreakAnim

## Class signature

```java
public class SPacketBlockBreakAnim extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketBlockBreakAnim()`
- `public SPacketBlockBreakAnim(int breakerIdIn, BlockPos positionIn, int progressIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public int getBreakerId()`
- `public BlockPos getPosition()`
- `public int getProgress()`