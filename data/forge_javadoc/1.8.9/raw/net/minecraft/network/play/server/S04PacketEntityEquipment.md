---
title: "S04PacketEntityEquipment"
description: "public class S04PacketEntityEquipment extends java.lang.Object implements Packet<INetHandlerPlayClient>"
package: "net/minecraft/network/play/server"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/play/server/S04PacketEntityEquipment.html"
sourceType: javadoc
---

# S04PacketEntityEquipment

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.S04PacketEntityEquipment

## Class signature

```java
public class S04PacketEntityEquipment extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `S04PacketEntityEquipment()`
- `S04PacketEntityEquipment(int entityIDIn, int p_i45221_2_, ItemStack itemStackIn)`

## Methods

- `int getEntityID()`
- `int getEquipmentSlot()`
- `ItemStack getItemStack()`
- `void processPacket(INetHandlerPlayClient handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.
