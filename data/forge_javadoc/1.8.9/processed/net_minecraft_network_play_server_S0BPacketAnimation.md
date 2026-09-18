# S0BPacketAnimation

## Class signature

```java
public class S0BPacketAnimation extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public S0BPacketAnimation()`
- `public S0BPacketAnimation( Entity ent, int animationType)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public int getEntityID()`
- `public int getAnimationType()`

## Description

Passes this Packet on to the NetHandler for processing.