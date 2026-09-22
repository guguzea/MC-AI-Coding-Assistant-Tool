# CPacketHeldItemChange

**Inheritance:** java.lang.Object → net.minecraft.network.play.client.CPacketHeldItemChange

## Class signature

```java
public class CPacketHeldItemChange extends java.lang.Object implements Packet<INetHandlerPlayServer>
```

## Constructors

- `CPacketHeldItemChange()`
- `CPacketHeldItemChange(int slotIdIn)`

## Methods

- `int getSlotId()`
- `void processPacket(INetHandlerPlayServer handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`