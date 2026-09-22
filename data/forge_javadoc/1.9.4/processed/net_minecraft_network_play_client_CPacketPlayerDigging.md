# CPacketPlayerDigging

**Inheritance:** java.lang.Object → net.minecraft.network.play.client.CPacketPlayerDigging

## Class signature

```java
public class CPacketPlayerDigging extends java.lang.Object implements Packet<INetHandlerPlayServer>
```

## Constructors

- `CPacketPlayerDigging()`
- `CPacketPlayerDigging(CPacketPlayerDigging.Action actionIn, BlockPos posIn, EnumFacing facingIn)`

## Methods

- `CPacketPlayerDigging.Action getAction()`
- `EnumFacing getFacing()`
- `BlockPos getPosition()`
- `void processPacket(INetHandlerPlayServer handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`