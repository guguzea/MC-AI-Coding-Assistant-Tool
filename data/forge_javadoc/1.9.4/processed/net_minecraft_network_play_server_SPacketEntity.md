# SPacketEntity

## Class signature

```java
public class SPacketEntity extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketEntity()`
- `public SPacketEntity(int entityIdIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public java.lang.String toString()`
- `public Entity getEntity( World worldIn)`
- `public int getX()`
- `public int getY()`
- `public int getZ()`
- `public byte getYaw()`
- `public byte getPitch()`
- `public boolean isRotating()`
- `public boolean getOnGround()`