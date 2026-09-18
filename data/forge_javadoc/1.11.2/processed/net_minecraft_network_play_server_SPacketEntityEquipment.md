# SPacketEntityEquipment

## Class signature

```java
public class SPacketEntityEquipment extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketEntityEquipment()`
- `public SPacketEntityEquipment(int entityIdIn, EntityEquipmentSlot equipmentSlotIn, ItemStack itemStackIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public ItemStack getItemStack()`
- `public int getEntityID()`
- `public EntityEquipmentSlot getEquipmentSlot()`