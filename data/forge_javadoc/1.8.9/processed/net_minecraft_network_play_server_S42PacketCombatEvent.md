# S42PacketCombatEvent

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.S42PacketCombatEvent

## Class signature

```java
public class S42PacketCombatEvent extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `S42PacketCombatEvent()`
- `S42PacketCombatEvent(CombatTracker combatTrackerIn, S42PacketCombatEvent.Event combatEventType)`

## Methods

- `void processPacket(INetHandlerPlayClient handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.

## Fields

- `java.lang.String deathMessage`
- `S42PacketCombatEvent.Event eventType`
- `int field_179772_d`
- `int field_179774_b`
- `int field_179775_c`