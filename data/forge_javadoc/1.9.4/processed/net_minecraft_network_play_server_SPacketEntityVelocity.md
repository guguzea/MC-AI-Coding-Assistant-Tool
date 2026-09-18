# SPacketEntityVelocity

## Class signature

```java
public class SPacketEntityVelocity extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketEntityVelocity()`
- `public SPacketEntityVelocity( Entity entityIn)`
- `public SPacketEntityVelocity(int entityIdIn, double motionXIn, double motionYIn, double motionZIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public int getEntityID()`
- `public int getMotionX()`
- `public int getMotionY()`
- `public int getMotionZ()`