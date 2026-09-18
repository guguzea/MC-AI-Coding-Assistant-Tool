# C18PacketSpectate

## Class signature

```java
public class C18PacketSpectate extends java.lang.Object implements Packet < INetHandlerPlayServer >
```

## Constructors

- `public C18PacketSpectate()`
- `public C18PacketSpectate(java.util.UUID id)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayServer handler)`
- `public Entity getEntity( WorldServer worldIn)`

## Description

Passes this Packet on to the NetHandler for processing.