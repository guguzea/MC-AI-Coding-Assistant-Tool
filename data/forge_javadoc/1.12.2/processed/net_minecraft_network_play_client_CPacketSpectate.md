# CPacketSpectate

**Inheritance:** java.lang.Object → net.minecraft.network.play.client.CPacketSpectate

## Class signature

```java
public class CPacketSpectate extends java.lang.Object implements Packet<INetHandlerPlayServer>
```

## Constructors

- `CPacketSpectate()`
- `CPacketSpectate(java.util.UUID uniqueIdIn)`

## Methods

- `Entity getEntity(WorldServer worldIn)`
- `void processPacket(INetHandlerPlayServer handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`