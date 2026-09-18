# SPacketSetPassengers

## Class signature

```java
public class SPacketSetPassengers extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketSetPassengers()`
- `public SPacketSetPassengers( Entity entityIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public int[] getPassengerIds()`
- `public int getEntityId()`