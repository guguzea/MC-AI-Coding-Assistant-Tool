# S01PacketPong

## Class signature

```java
public class S01PacketPong extends java.lang.Object implements Packet < INetHandlerStatusClient >
```

## Constructors

- `public S01PacketPong()`
- `public S01PacketPong(long time)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerStatusClient handler)`

## Description

Passes this Packet on to the NetHandler for processing.