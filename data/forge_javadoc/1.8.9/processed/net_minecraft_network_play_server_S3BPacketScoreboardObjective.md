# S3BPacketScoreboardObjective

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.S3BPacketScoreboardObjective

## Class signature

```java
public class S3BPacketScoreboardObjective extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `S3BPacketScoreboardObjective()`
- `S3BPacketScoreboardObjective(ScoreObjective p_i45224_1_, int p_i45224_2_)`

## Methods

- `java.lang.String func_149337_d()`
- `int func_149338_e()`
- `java.lang.String func_149339_c()`
- `IScoreObjectiveCriteria.EnumRenderType func_179817_d()`
- `void processPacket(INetHandlerPlayClient handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.