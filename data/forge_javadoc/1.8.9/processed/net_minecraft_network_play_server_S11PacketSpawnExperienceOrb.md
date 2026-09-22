# S11PacketSpawnExperienceOrb

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.S11PacketSpawnExperienceOrb

## Class signature

```java
public class S11PacketSpawnExperienceOrb extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `S11PacketSpawnExperienceOrb()`
- `S11PacketSpawnExperienceOrb(EntityXPOrb xpOrb)`

## Methods

- `int getEntityID()`
- `int getX()`
- `int getXPValue()`
- `int getY()`
- `int getZ()`
- `void processPacket(INetHandlerPlayClient handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.