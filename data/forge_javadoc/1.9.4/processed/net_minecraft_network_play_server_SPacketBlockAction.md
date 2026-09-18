# SPacketBlockAction

## Class signature

```java
public class SPacketBlockAction extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketBlockAction()`
- `public SPacketBlockAction( BlockPos pos, Block blockIn, int instrumentIn, int pitchIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public BlockPos getBlockPosition()`
- `public int getData1()`
- `public int getData2()`
- `public Block getBlockType()`