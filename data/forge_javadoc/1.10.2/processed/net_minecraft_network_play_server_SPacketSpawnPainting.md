# SPacketSpawnPainting

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketSpawnPainting

## Class signature

```java
public class SPacketSpawnPainting extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketSpawnPainting()`
- `SPacketSpawnPainting(EntityPainting painting)`

## Methods

- `int getEntityID()`
- `EnumFacing getFacing()`
- `BlockPos getPosition()`
- `java.lang.String getTitle()`
- `java.util.UUID getUniqueId()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`