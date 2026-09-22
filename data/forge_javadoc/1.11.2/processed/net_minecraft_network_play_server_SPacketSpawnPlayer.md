# SPacketSpawnPlayer

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketSpawnPlayer

## Class signature

```java
public class SPacketSpawnPlayer extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketSpawnPlayer()`
- `SPacketSpawnPlayer(EntityPlayer player)`

## Methods

- `java.util.List<EntityDataManager.DataEntry<?>> getDataManagerEntries()`
- `int getEntityID()`
- `byte getPitch()`
- `java.util.UUID getUniqueId()`
- `double getX()`
- `double getY()`
- `byte getYaw()`
- `double getZ()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`