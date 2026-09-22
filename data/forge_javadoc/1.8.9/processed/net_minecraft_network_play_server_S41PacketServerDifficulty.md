# S41PacketServerDifficulty

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.S41PacketServerDifficulty

## Class signature

```java
public class S41PacketServerDifficulty extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `S41PacketServerDifficulty()`
- `S41PacketServerDifficulty(EnumDifficulty difficultyIn, boolean lockedIn)`

## Methods

- `EnumDifficulty getDifficulty()`
- `boolean isDifficultyLocked()`
- `void processPacket(INetHandlerPlayClient handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.