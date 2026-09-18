# S04PacketEntityEquipment

## Class signature

```java
public class S04PacketEntityEquipment extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public S04PacketEntityEquipment()`
- `public S04PacketEntityEquipment(int entityIDIn, int p_i45221_2_, ItemStack itemStackIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public ItemStack getItemStack()`
- `public int getEntityID()`
- `public int getEquipmentSlot()`

## Description

Passes this Packet on to the NetHandler for processing.