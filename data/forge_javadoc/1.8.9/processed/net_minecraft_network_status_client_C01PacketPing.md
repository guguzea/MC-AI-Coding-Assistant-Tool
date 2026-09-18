# C01PacketPing

## Class signature

```java
public class C01PacketPing extends java.lang.Object implements Packet < INetHandlerStatusServer >
```

## Constructors

- `public C01PacketPing()`
- `public C01PacketPing(long ping)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerStatusServer handler)`
- `public long getClientTime()`

## Description

Passes this Packet on to the NetHandler for processing.