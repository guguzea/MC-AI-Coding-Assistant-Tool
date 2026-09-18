# CPacketPing

## Class signature

```java
public class CPacketPing extends java.lang.Object implements Packet < INetHandlerStatusServer >
```

## Constructors

- `public CPacketPing()`
- `public CPacketPing(long clientTimeIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerStatusServer handler)`
- `public long getClientTime()`