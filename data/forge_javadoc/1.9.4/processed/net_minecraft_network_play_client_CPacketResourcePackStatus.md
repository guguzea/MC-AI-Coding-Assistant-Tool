# CPacketResourcePackStatus

**Inheritance:** java.lang.Object → net.minecraft.network.play.client.CPacketResourcePackStatus

## Class signature

```java
public class CPacketResourcePackStatus extends java.lang.Object implements Packet<INetHandlerPlayServer>
```

## Constructors

- `CPacketResourcePackStatus()`
- `CPacketResourcePackStatus(java.lang.String hashIn, CPacketResourcePackStatus.Action actionIn)`

## Methods

- `void processPacket(INetHandlerPlayServer handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`