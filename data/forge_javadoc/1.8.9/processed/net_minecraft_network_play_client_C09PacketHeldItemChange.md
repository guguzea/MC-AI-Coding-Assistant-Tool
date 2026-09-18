# C09PacketHeldItemChange

## Class signature

```java
public class C09PacketHeldItemChange extends java.lang.Object implements Packet < INetHandlerPlayServer >
```

## Constructors

- `public C09PacketHeldItemChange()`
- `public C09PacketHeldItemChange(int slotId)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayServer handler)`
- `public int getSlotId()`

## Description

Passes this Packet on to the NetHandler for processing.