# CPacketSpectate

## Class signature

```java
public class CPacketSpectate extends java.lang.Object implements Packet < INetHandlerPlayServer >
```

## Constructors

- `public CPacketSpectate()`
- `public CPacketSpectate(java.util.UUID uniqueIdIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayServer handler)`
- `public Entity getEntity( WorldServer worldIn)`