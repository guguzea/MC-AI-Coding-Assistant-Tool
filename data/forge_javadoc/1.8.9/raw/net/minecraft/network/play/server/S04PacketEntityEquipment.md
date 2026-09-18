---
title: "S04PacketEntityEquipment"
description: "Passes this Packet on to the NetHandler for processing."
package: "net/minecraft/network/play/server"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/play/server/S04PacketEntityEquipment.html"
sourceType: javadoc
---

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
