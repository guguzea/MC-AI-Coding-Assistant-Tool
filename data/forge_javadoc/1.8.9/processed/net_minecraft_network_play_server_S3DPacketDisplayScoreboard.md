# S3DPacketDisplayScoreboard

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.S3DPacketDisplayScoreboard

## Class signature

```java
public class S3DPacketDisplayScoreboard extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `S3DPacketDisplayScoreboard()`
- `S3DPacketDisplayScoreboard(int positionIn, ScoreObjective scoreIn)`

## Methods

- `java.lang.String func_149370_d()`
- `int func_149371_c()`
- `void processPacket(INetHandlerPlayClient handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.