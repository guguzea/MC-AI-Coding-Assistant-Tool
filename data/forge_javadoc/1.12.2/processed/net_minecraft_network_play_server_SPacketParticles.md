# SPacketParticles

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketParticles

## Class signature

```java
public class SPacketParticles extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketParticles()`
- `SPacketParticles(EnumParticleTypes particleIn, boolean longDistanceIn, float xIn, float yIn, float zIn, float xOffsetIn, float yOffsetIn, float zOffsetIn, float speedIn, int countIn, int... argumentsIn)`

## Methods

- `int[] getParticleArgs()`
- `int getParticleCount()`
- `float getParticleSpeed()`
- `EnumParticleTypes getParticleType()`
- `double getXCoordinate()`
- `float getXOffset()`
- `double getYCoordinate()`
- `float getYOffset()`
- `double getZCoordinate()`
- `float getZOffset()`
- `boolean isLongDistance()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`