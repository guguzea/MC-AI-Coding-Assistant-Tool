# SPacketPong

## Class signature

```java
public class SPacketPong extends java.lang.Object implements Packet < INetHandlerStatusClient >
```

## Constructors

- `public SPacketPong()`
- `public SPacketPong(long clientTimeIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerStatusClient handler)`