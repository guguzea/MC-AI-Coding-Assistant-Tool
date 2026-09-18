# CPacketHeldItemChange

## Class signature

```java
public class CPacketHeldItemChange extends java.lang.Object implements Packet < INetHandlerPlayServer >
```

## Constructors

- `public CPacketHeldItemChange()`
- `public CPacketHeldItemChange(int slotIdIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayServer handler)`
- `public int getSlotId()`