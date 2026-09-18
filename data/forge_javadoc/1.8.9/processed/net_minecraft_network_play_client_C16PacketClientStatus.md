# C16PacketClientStatus

## Class signature

```java
public class C16PacketClientStatus extends java.lang.Object implements Packet < INetHandlerPlayServer >
```

## Constructors

- `public C16PacketClientStatus()`
- `public C16PacketClientStatus( C16PacketClientStatus.EnumState statusIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayServer handler)`
- `public C16PacketClientStatus.EnumState getStatus()`

## Description

Passes this Packet on to the NetHandler for processing.