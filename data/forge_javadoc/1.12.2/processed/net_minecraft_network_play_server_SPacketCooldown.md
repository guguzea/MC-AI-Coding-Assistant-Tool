# SPacketCooldown

## Class signature

```java
public class SPacketCooldown extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketCooldown()`
- `public SPacketCooldown( Item itemIn, int ticksIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public Item getItem()`
- `public int getTicks()`