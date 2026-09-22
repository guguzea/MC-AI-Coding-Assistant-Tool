---
title: "SPacketEntityEquipment"
description: "public class SPacketEntityEquipment extends java.lang.Object implements Packet<INetHandlerPlayClient>"
package: "net/minecraft/network/play/server"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/network/play/server/SPacketEntityEquipment.html"
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
