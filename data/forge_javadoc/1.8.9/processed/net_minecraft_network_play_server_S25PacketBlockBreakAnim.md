# S25PacketBlockBreakAnim

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.S25PacketBlockBreakAnim

## Class signature

```java
public class S25PacketBlockBreakAnim extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `S25PacketBlockBreakAnim()`
- `S25PacketBlockBreakAnim(int breakerId, BlockPos pos, int progress)`

## Methods

- `int getBreakerId()`
- `BlockPos getPosition()`
- `int getProgress()`
- `void processPacket(INetHandlerPlayClient handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.