# SPacketDestroyEntities

## Class signature

```java
public class SPacketDestroyEntities extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketDestroyEntities()`
- `public SPacketDestroyEntities(int... entityIdsIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public int[] getEntityIDs()`