# SPacketTeams

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketTeams

## Class signature

```java
public class SPacketTeams extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketTeams()`
- `SPacketTeams(ScorePlayerTeam teamIn, java.util.Collection<java.lang.String> playersIn, int actionIn)`
- `SPacketTeams(ScorePlayerTeam teamIn, int actionIn)`

## Methods

- `int getAction()`
- `java.lang.String getCollisionRule()`
- `int getColor()`
- `java.lang.String getDisplayName()`
- `int getFriendlyFlags()`
- `java.lang.String getName()`
- `java.lang.String getNameTagVisibility()`
- `java.util.Collection<java.lang.String> getPlayers()`
- `java.lang.String getPrefix()`
- `java.lang.String getSuffix()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`