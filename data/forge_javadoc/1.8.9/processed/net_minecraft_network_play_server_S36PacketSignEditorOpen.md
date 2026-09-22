# S36PacketSignEditorOpen

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.S36PacketSignEditorOpen

## Class signature

```java
public class S36PacketSignEditorOpen extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `S36PacketSignEditorOpen()`
- `S36PacketSignEditorOpen(BlockPos signPositionIn)`

## Methods

- `BlockPos getSignPosition()`
- `void processPacket(INetHandlerPlayClient handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.