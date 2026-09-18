# S12PacketEntityVelocity

## Class signature

```java
public class S12PacketEntityVelocity extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public S12PacketEntityVelocity()`
- `public S12PacketEntityVelocity( Entity entityIn)`
- `public S12PacketEntityVelocity(int entityIDIn, double motionXIn, double motionYIn, double motionZIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public int getEntityID()`
- `public int getMotionX()`
- `public int getMotionY()`
- `public int getMotionZ()`

## Description

Passes this Packet on to the NetHandler for processing.