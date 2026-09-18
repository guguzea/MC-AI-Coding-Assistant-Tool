# C19PacketResourcePackStatus

## Class signature

```java
public class C19PacketResourcePackStatus extends java.lang.Object implements Packet < INetHandlerPlayServer >
```

## Constructors

- `public C19PacketResourcePackStatus()`
- `public C19PacketResourcePackStatus(java.lang.String hashIn, C19PacketResourcePackStatus.Action statusIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayServer handler)`

## Description

Passes this Packet on to the NetHandler for processing.