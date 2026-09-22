# SPacketServerDifficulty

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketServerDifficulty

## Class signature

```java
public class SPacketServerDifficulty extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketServerDifficulty()`
- `SPacketServerDifficulty(EnumDifficulty difficultyIn, boolean difficultyLockedIn)`

## Methods

- `EnumDifficulty getDifficulty()`
- `boolean isDifficultyLocked()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`