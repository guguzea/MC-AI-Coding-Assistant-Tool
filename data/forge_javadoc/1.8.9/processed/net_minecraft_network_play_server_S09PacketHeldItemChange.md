# S09PacketHeldItemChange

## Class signature

```java
public class S09PacketHeldItemChange extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public S09PacketHeldItemChange()`
- `public S09PacketHeldItemChange(int hotbarIndexIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public int getHeldItemHotbarIndex()`

## Description

Passes this Packet on to the NetHandler for processing.