# SPacketBlockChange

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketBlockChange

## Class signature

```java
public class SPacketBlockChange extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketBlockChange()`
- `SPacketBlockChange(World worldIn, BlockPos posIn)`

## Methods

- `BlockPos getBlockPosition()`
- `IBlockState getBlockState()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`

## Fields

- `IBlockState blockState`