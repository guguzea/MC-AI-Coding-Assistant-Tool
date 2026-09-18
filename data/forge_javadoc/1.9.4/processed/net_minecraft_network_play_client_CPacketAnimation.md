# CPacketAnimation

## Class signature

```java
public class CPacketAnimation extends java.lang.Object implements Packet < INetHandlerPlayServer >
```

## Constructors

- `public CPacketAnimation()`
- `public CPacketAnimation( EnumHand handIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayServer handler)`
- `public EnumHand getHand()`