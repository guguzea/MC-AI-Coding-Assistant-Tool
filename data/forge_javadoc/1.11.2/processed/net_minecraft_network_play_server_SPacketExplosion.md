# SPacketExplosion

## Class signature

```java
public class SPacketExplosion extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketExplosion()`
- `public SPacketExplosion(double xIn, double yIn, double zIn, float strengthIn, java.util.List< BlockPos > affectedBlockPositionsIn, Vec3d motion)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public float getMotionX()`
- `public float getMotionY()`
- `public float getMotionZ()`
- `public double getX()`
- `public double getY()`
- `public double getZ()`
- `public float getStrength()`
- `public java.util.List< BlockPos > getAffectedBlockPositions()`