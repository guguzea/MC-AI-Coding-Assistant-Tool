# SPacketCombatEvent

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketCombatEvent

## Class signature

```java
public class SPacketCombatEvent extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketCombatEvent()`
- `SPacketCombatEvent(CombatTracker tracker, SPacketCombatEvent.Event eventIn)`
- `SPacketCombatEvent(CombatTracker tracker, SPacketCombatEvent.Event eventIn, boolean p_i46932_3_)`

## Methods

- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`

## Fields

- `ITextComponent deathMessage`
- `int duration`
- `int entityId`
- `SPacketCombatEvent.Event eventType`
- `int playerId`