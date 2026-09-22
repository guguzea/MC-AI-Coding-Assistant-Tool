# SPacketSpawnPosition

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketSpawnPosition

## Class signature

```java
public class SPacketSpawnPosition extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketSpawnPosition()`
- `SPacketSpawnPosition(BlockPos posIn)`

## Methods

- `BlockPos getSpawnPos()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`