# C00PacketServerQuery

## Class signature

```java
public class C00PacketServerQuery extends java.lang.Object implements Packet < INetHandlerStatusServer >
```

## Constructors

- `public C00PacketServerQuery()`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerStatusServer handler)`

## Description

Passes this Packet on to the NetHandler for processing.