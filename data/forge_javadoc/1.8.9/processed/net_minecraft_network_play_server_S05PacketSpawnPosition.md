# S05PacketSpawnPosition

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.S05PacketSpawnPosition

## Class signature

```java
public class S05PacketSpawnPosition extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `S05PacketSpawnPosition()`
- `S05PacketSpawnPosition(BlockPos spawnBlockPosIn)`

## Methods

- `BlockPos getSpawnPos()`
- `void processPacket(INetHandlerPlayClient handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.