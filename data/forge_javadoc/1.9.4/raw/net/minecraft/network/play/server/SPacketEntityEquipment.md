---
title: "SPacketEntityEquipment"
description: "public class SPacketEntityEquipment extends java.lang.Object implements Packet < INetHandlerPlayClient >"
package: "net/minecraft/network/play/server"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/network/play/server/SPacketEntityEquipment.html"
sourceType: javadoc
---

# SPacketEntityEquipment

## Class signature

```java
public class SPacketEntityEquipment extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketEntityEquipment()`
- `public SPacketEntityEquipment(int entityIdIn, EntityEquipmentSlot equipmentSlotIn, @Nullable ItemStack itemStackIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public ItemStack getItemStack()`
- `public int getEntityID()`
- `public EntityEquipmentSlot getEquipmentSlot()`
