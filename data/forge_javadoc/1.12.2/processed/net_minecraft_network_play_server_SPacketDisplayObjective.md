# SPacketDisplayObjective

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketDisplayObjective

## Class signature

```java
public class SPacketDisplayObjective extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketDisplayObjective()`
- `SPacketDisplayObjective(int positionIn, ScoreObjective objective)`

## Methods

- `java.lang.String getName()`
- `int getPosition()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`