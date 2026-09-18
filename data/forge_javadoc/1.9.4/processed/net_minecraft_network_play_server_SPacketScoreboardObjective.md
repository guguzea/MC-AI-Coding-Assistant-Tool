# SPacketScoreboardObjective

## Class signature

```java
public class SPacketScoreboardObjective extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketScoreboardObjective()`
- `public SPacketScoreboardObjective( ScoreObjective objective, int actionIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public java.lang.String getObjectiveName()`
- `public java.lang.String getObjectiveValue()`
- `public int getAction()`
- `public IScoreCriteria.EnumRenderType getRenderType()`