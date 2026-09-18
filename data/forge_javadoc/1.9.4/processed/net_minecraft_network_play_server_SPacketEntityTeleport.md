# SPacketEntityTeleport

## Class signature

```java
public class SPacketEntityTeleport extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketEntityTeleport()`
- `public SPacketEntityTeleport( Entity entityIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public int getEntityId()`
- `public double getX()`
- `public double getY()`
- `public double getZ()`
- `public byte getYaw()`
- `public byte getPitch()`
- `public boolean getOnGround()`