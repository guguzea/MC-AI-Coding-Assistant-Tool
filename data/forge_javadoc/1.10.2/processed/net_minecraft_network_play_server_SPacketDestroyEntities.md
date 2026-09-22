# SPacketDestroyEntities

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketDestroyEntities

## Class signature

```java
public class SPacketDestroyEntities extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketDestroyEntities()`
- `SPacketDestroyEntities(int... entityIdsIn)`

## Methods

- `int[] getEntityIDs()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`