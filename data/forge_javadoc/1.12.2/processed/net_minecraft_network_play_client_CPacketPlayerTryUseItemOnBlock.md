# CPacketPlayerTryUseItemOnBlock

**Inheritance:** java.lang.Object → net.minecraft.network.play.client.CPacketPlayerTryUseItemOnBlock

## Class signature

```java
public class CPacketPlayerTryUseItemOnBlock extends java.lang.Object implements Packet<INetHandlerPlayServer>
```

## Constructors

- `CPacketPlayerTryUseItemOnBlock()`
- `CPacketPlayerTryUseItemOnBlock(BlockPos posIn, EnumFacing placedBlockDirectionIn, EnumHand handIn, float facingXIn, float facingYIn, float facingZIn)`

## Methods

- `EnumFacing getDirection()`
- `float getFacingX()`
- `float getFacingY()`
- `float getFacingZ()`
- `EnumHand getHand()`
- `BlockPos getPos()`
- `void processPacket(INetHandlerPlayServer handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`