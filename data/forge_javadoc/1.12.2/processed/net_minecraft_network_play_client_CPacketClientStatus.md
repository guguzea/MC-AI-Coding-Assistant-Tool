# CPacketClientStatus

**Inheritance:** java.lang.Object → net.minecraft.network.play.client.CPacketClientStatus

## Class signature

```java
public class CPacketClientStatus extends java.lang.Object implements Packet<INetHandlerPlayServer>
```

## Constructors

- `CPacketClientStatus()`
- `CPacketClientStatus(CPacketClientStatus.State p_i46886_1_)`

## Methods

- `CPacketClientStatus.State getStatus()`
- `void processPacket(INetHandlerPlayServer handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`