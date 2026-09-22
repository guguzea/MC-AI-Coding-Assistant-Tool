# S0APacketUseBed

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.S0APacketUseBed

## Class signature

```java
public class S0APacketUseBed extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `S0APacketUseBed()`
- `S0APacketUseBed(EntityPlayer player, BlockPos bedPosIn)`

## Methods

- `BlockPos getBedPosition()`
- `EntityPlayer getPlayer(World worldIn)`
- `void processPacket(INetHandlerPlayClient handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.