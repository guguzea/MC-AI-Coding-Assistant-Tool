# CPacketPlayer

## Class signature

```java
public class CPacketPlayer extends java.lang.Object implements Packet < INetHandlerPlayServer >
```

## Constructors

- `public CPacketPlayer()`
- `public CPacketPlayer(boolean onGroundIn)`

## Methods

- `public void processPacket( INetHandlerPlayServer handler)`
- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public double getX(double defaultValue)`
- `public double getY(double defaultValue)`
- `public double getZ(double defaultValue)`
- `public float getYaw(float defaultValue)`
- `public float getPitch(float defaultValue)`
- `public boolean isOnGround()`