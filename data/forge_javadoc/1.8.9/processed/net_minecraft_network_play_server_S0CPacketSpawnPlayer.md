# S0CPacketSpawnPlayer

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.S0CPacketSpawnPlayer

## Class signature

```java
public class S0CPacketSpawnPlayer extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `S0CPacketSpawnPlayer()`
- `S0CPacketSpawnPlayer(EntityPlayer player)`

## Methods

- `java.util.List<DataWatcher.WatchableObject> func_148944_c()`
- `int getCurrentItemID()`
- `int getEntityID()`
- `byte getPitch()`
- `java.util.UUID getPlayer()`
- `int getX()`
- `int getY()`
- `byte getYaw()`
- `int getZ()`
- `void processPacket(INetHandlerPlayClient handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.