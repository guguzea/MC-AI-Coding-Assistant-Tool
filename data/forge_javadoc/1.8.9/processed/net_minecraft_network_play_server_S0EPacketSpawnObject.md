# S0EPacketSpawnObject

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.S0EPacketSpawnObject

## Class signature

```java
public class S0EPacketSpawnObject extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `S0EPacketSpawnObject()`
- `S0EPacketSpawnObject(Entity entityIn, int typeIn)`
- `S0EPacketSpawnObject(Entity entityIn, int typeIn, int p_i45166_3_)`

## Methods

- `void func_149002_g(int p_149002_1_)`
- `int func_149009_m()`
- `int getEntityID()`
- `int getPitch()`
- `int getSpeedX()`
- `int getSpeedY()`
- `int getSpeedZ()`
- `int getType()`
- `int getX()`
- `int getY()`
- `int getYaw()`
- `int getZ()`
- `void processPacket(INetHandlerPlayClient handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void setSpeedX(int newSpeedX)`
- `void setSpeedY(int newSpeedY)`
- `void setSpeedZ(int newSpeedZ)`
- `void setX(int newX)`
- `void setY(int newY)`
- `void setZ(int newZ)`
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.