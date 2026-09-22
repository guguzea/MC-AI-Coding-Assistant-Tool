# SPacketUpdateScore

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketUpdateScore

## Class signature

```java
public class SPacketUpdateScore extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketUpdateScore()`
- `SPacketUpdateScore(Score scoreIn)`
- `SPacketUpdateScore(java.lang.String nameIn)`
- `SPacketUpdateScore(java.lang.String nameIn, ScoreObjective objectiveIn)`

## Methods

- `java.lang.String getObjectiveName()`
- `java.lang.String getPlayerName()`
- `SPacketUpdateScore.Action getScoreAction()`
- `int getScoreValue()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`