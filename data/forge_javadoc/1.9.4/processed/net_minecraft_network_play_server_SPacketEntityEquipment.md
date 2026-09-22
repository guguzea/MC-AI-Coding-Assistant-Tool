# SPacketEntityEquipment

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketEntityEquipment

## Class signature

```java
public class SPacketEntityEquipment extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketEntityEquipment()`
- `SPacketEntityEquipment(int entityIdIn, EntityEquipmentSlot equipmentSlotIn, ItemStack itemStackIn)`

## Methods

- `int getEntityID()`
- `EntityEquipmentSlot getEquipmentSlot()`
- `ItemStack getItemStack()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`