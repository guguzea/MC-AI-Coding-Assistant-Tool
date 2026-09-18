# C00PacketKeepAlive

## Class signature

```java
public class C00PacketKeepAlive extends java.lang.Object implements Packet < INetHandlerPlayServer >
```

## Constructors

- `public C00PacketKeepAlive()`
- `public C00PacketKeepAlive(int key)`

## Methods

- `public void processPacket( INetHandlerPlayServer handler)`
- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public int getKey()`

## Description

Passes this Packet on to the NetHandler for processing.