# SPacketCombatEvent

## Class signature

```java
public class SPacketCombatEvent extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketCombatEvent()`
- `public SPacketCombatEvent( CombatTracker tracker, SPacketCombatEvent.Event eventIn)`
- `public SPacketCombatEvent( CombatTracker tracker, SPacketCombatEvent.Event eventIn, boolean p_i46932_3_)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`