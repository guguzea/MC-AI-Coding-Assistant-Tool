# S22PacketMultiBlockChange

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.S22PacketMultiBlockChange

## Class signature

```java
public class S22PacketMultiBlockChange extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `S22PacketMultiBlockChange()`
- `S22PacketMultiBlockChange(int p_i45181_1_, short[] crammedPositionsIn, Chunk chunkIn)`

## Methods

- `S22PacketMultiBlockChange.BlockUpdateData [] getChangedBlocks()`
- `void processPacket(INetHandlerPlayClient handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.