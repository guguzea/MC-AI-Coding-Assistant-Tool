# S13PacketDestroyEntities

## Class signature

```java
public class S13PacketDestroyEntities extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public S13PacketDestroyEntities()`
- `public S13PacketDestroyEntities(int... entityIDsIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public int[] getEntityIDs()`

## Description

Passes this Packet on to the NetHandler for processing.