# SPacketAnimation

## Class signature

```java
public class SPacketAnimation extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketAnimation()`
- `public SPacketAnimation( Entity entityIn, int typeIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public int getEntityID()`
- `public int getAnimationType()`