# CPacketCreativeInventoryAction

**Inheritance:** java.lang.Object → net.minecraft.network.play.client.CPacketCreativeInventoryAction

## Class signature

```java
public class CPacketCreativeInventoryAction extends java.lang.Object implements Packet<INetHandlerPlayServer>
```

## Constructors

- `CPacketCreativeInventoryAction()`
- `CPacketCreativeInventoryAction(int slotIdIn, ItemStack stackIn)`

## Methods

- `int getSlotId()`
- `ItemStack getStack()`
- `void processPacket(INetHandlerPlayServer handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`