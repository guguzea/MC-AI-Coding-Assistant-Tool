# CPacketPlayerTryUseItemOnBlock

## Class signature

```java
public class CPacketPlayerTryUseItemOnBlock extends java.lang.Object implements Packet < INetHandlerPlayServer >
```

## Constructors

- `public CPacketPlayerTryUseItemOnBlock()`
- `public CPacketPlayerTryUseItemOnBlock( BlockPos posIn, EnumFacing placedBlockDirectionIn, EnumHand handIn, float facingXIn, float facingYIn, float facingZIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayServer handler)`
- `public BlockPos getPos()`
- `public EnumFacing getDirection()`
- `public EnumHand getHand()`
- `public float getFacingX()`
- `public float getFacingY()`
- `public float getFacingZ()`