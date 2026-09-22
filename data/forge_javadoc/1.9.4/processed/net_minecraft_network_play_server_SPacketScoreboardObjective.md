# SPacketScoreboardObjective

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketScoreboardObjective

## Class signature

```java
public class SPacketScoreboardObjective extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketScoreboardObjective()`
- `SPacketScoreboardObjective(ScoreObjective objective, int actionIn)`

## Methods

- `int getAction()`
- `java.lang.String getObjectiveName()`
- `java.lang.String getObjectiveValue()`
- `IScoreCriteria.EnumRenderType getRenderType()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`