# S33PacketUpdateSign

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.S33PacketUpdateSign

## Class signature

```java
public class S33PacketUpdateSign extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `S33PacketUpdateSign()`
- `S33PacketUpdateSign(World worldIn, BlockPos blockPosIn, IChatComponent [] linesIn)`

## Methods

- `IChatComponent [] getLines()`
- `BlockPos getPos()`
- `void processPacket(INetHandlerPlayClient handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.