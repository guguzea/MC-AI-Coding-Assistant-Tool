# SPacketSpawnExperienceOrb

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketSpawnExperienceOrb

## Class signature

```java
public class SPacketSpawnExperienceOrb extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketSpawnExperienceOrb()`
- `SPacketSpawnExperienceOrb(EntityXPOrb orb)`

## Methods

- `int getEntityID()`
- `double getX()`
- `int getXPValue()`
- `double getY()`
- `double getZ()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`