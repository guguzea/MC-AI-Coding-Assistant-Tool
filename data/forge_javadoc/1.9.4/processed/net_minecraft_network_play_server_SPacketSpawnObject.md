# SPacketSpawnObject

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketSpawnObject

## Class signature

```java
public class SPacketSpawnObject extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketSpawnObject()`
- `SPacketSpawnObject(Entity entityIn, int typeIn)`
- `SPacketSpawnObject(Entity entityIn, int typeIn, int dataIn)`
- `SPacketSpawnObject(Entity entityIn, int typeIn, int dataIn, BlockPos pos)`

## Methods

- `int getData()`
- `int getEntityID()`
- `int getPitch()`
- `int getSpeedX()`
- `int getSpeedY()`
- `int getSpeedZ()`
- `int getType()`
- `java.util.UUID getUniqueId()`
- `double getX()`
- `double getY()`
- `int getYaw()`
- `double getZ()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void setData(int dataIn)`
- `void setSpeedX(int newSpeedX)`
- `void setSpeedY(int newSpeedY)`
- `void setSpeedZ(int newSpeedZ)`
- `void writePacketData(PacketBuffer buf)`