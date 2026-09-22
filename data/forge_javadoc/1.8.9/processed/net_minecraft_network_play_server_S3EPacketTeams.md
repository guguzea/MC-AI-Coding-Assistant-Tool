# S3EPacketTeams

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.S3EPacketTeams

## Class signature

```java
public class S3EPacketTeams extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `S3EPacketTeams()`
- `S3EPacketTeams(ScorePlayerTeam p_i45226_1_, java.util.Collection<java.lang.String> p_i45226_2_, int p_i45226_3_)`
- `S3EPacketTeams(ScorePlayerTeam p_i45225_1_, int p_i45225_2_)`

## Methods

- `java.lang.String func_149306_d()`
- `int func_149307_h()`
- `int func_149308_i()`
- `java.lang.String func_149309_f()`
- `java.util.Collection<java.lang.String> func_149310_g()`
- `java.lang.String func_149311_e()`
- `java.lang.String func_149312_c()`
- `int func_179813_h()`
- `java.lang.String func_179814_i()`
- `void processPacket(INetHandlerPlayClient handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.