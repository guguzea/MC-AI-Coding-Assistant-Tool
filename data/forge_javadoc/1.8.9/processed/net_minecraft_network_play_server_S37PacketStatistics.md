# S37PacketStatistics

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.S37PacketStatistics

## Class signature

```java
public class S37PacketStatistics extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `S37PacketStatistics()`
- `S37PacketStatistics(java.util.Map<StatBase, java.lang.Integer> p_i45173_1_)`

## Methods

- `java.util.Map<StatBase, java.lang.Integer> func_148974_c()`
- `void processPacket(INetHandlerPlayClient handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.