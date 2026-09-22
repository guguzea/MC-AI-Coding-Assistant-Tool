# CPacketConfirmTeleport

**Inheritance:** java.lang.Object → net.minecraft.network.play.client.CPacketConfirmTeleport

## Class signature

```java
public class CPacketConfirmTeleport extends java.lang.Object implements Packet<INetHandlerPlayServer>
```

## Constructors

- `CPacketConfirmTeleport()`
- `CPacketConfirmTeleport(int teleportIdIn)`

## Methods

- `int getTeleportId()`
- `void processPacket(INetHandlerPlayServer handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`