# SPacketUseBed

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketUseBed

## Class signature

```java
public class SPacketUseBed extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketUseBed()`
- `SPacketUseBed(EntityPlayer player, BlockPos posIn)`

## Methods

- `BlockPos getBedPosition()`
- `EntityPlayer getPlayer(World worldIn)`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`