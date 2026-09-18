# SPacketMoveVehicle

## Class signature

```java
public class SPacketMoveVehicle extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketMoveVehicle()`
- `public SPacketMoveVehicle( Entity entityIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public double getX()`
- `public double getY()`
- `public double getZ()`
- `public float getYaw()`
- `public float getPitch()`