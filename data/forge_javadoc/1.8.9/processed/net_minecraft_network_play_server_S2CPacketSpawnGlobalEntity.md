# S2CPacketSpawnGlobalEntity

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.S2CPacketSpawnGlobalEntity

## Class signature

```java
public class S2CPacketSpawnGlobalEntity extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `S2CPacketSpawnGlobalEntity()`
- `S2CPacketSpawnGlobalEntity(Entity entityIn)`

## Methods

- `int func_149049_f()`
- `int func_149050_e()`
- `int func_149051_d()`
- `int func_149052_c()`
- `int func_149053_g()`
- `void processPacket(INetHandlerPlayClient handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.