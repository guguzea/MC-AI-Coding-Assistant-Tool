# SPacketSpawnMob

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketSpawnMob

## Class signature

```java
public class SPacketSpawnMob extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketSpawnMob()`
- `SPacketSpawnMob(EntityLivingBase entityIn)`

## Methods

- `java.util.List<EntityDataManager.DataEntry<?>> getDataManagerEntries()`
- `int getEntityID()`
- `int getEntityType()`
- `byte getHeadPitch()`
- `byte getPitch()`
- `java.util.UUID getUniqueId()`
- `int getVelocityX()`
- `int getVelocityY()`
- `int getVelocityZ()`
- `double getX()`
- `double getY()`
- `byte getYaw()`
- `double getZ()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`