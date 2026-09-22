# S23PacketBlockChange

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.S23PacketBlockChange

## Class signature

```java
public class S23PacketBlockChange extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `S23PacketBlockChange()`
- `S23PacketBlockChange(World worldIn, BlockPos blockPositionIn)`

## Methods

- `BlockPos getBlockPosition()`
- `IBlockState getBlockState()`
- `void processPacket(INetHandlerPlayClient handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.

## Fields

- `IBlockState blockState`