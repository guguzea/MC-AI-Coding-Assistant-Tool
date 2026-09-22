# SPacketExplosion

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketExplosion

## Class signature

```java
public class SPacketExplosion extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketExplosion()`
- `SPacketExplosion(double xIn, double yIn, double zIn, float strengthIn, java.util.List<BlockPos> affectedBlockPositionsIn, Vec3d motion)`

## Methods

- `java.util.List<BlockPos> getAffectedBlockPositions()`
- `float getMotionX()`
- `float getMotionY()`
- `float getMotionZ()`
- `float getStrength()`
- `double getX()`
- `double getY()`
- `double getZ()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`