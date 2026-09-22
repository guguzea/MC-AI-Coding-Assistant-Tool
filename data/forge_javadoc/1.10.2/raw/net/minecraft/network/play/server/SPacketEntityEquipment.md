---
title: "SPacketEntityEquipment"
description: "public class SPacketEntityEquipment extends java.lang.Object implements Packet<INetHandlerPlayClient>"
package: "net/minecraft/network/play/server"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/network/play/server/SPacketEntityEquipment.html"
sourceType: javadoc
---

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
