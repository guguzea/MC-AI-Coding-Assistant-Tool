# SPacketSpawnGlobalEntity

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketSpawnGlobalEntity

## Class signature

```java
public class SPacketSpawnGlobalEntity extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketSpawnGlobalEntity()`
- `SPacketSpawnGlobalEntity(Entity entityIn)`

## Methods

- `int getEntityId()`
- `int getType()`
- `double getX()`
- `double getY()`
- `double getZ()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`