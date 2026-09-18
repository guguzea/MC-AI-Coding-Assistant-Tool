# SPacketParticles

## Class signature

```java
public class SPacketParticles extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketParticles()`
- `public SPacketParticles( EnumParticleTypes particleIn, boolean longDistanceIn, float xIn, float yIn, float zIn, float xOffsetIn, float yOffsetIn, float zOffsetIn, float speedIn, int countIn, int... argumentsIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public EnumParticleTypes getParticleType()`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public boolean isLongDistance()`
- `public double getXCoordinate()`
- `public double getYCoordinate()`
- `public double getZCoordinate()`
- `public float getXOffset()`
- `public float getYOffset()`
- `public float getZOffset()`
- `public float getParticleSpeed()`
- `public int getParticleCount()`
- `public int[] getParticleArgs()`