---
title: "C10PacketCreativeInventoryAction"
description: "Passes this Packet on to the NetHandler for processing."
package: "net/minecraft/network/play/client"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/play/client/C10PacketCreativeInventoryAction.html"
sourceType: javadoc
---

# C10PacketCreativeInventoryAction

## Class signature

```java
public class C10PacketCreativeInventoryAction extends java.lang.Object implements Packet < INetHandlerPlayServer >
```

## Constructors

- `public C10PacketCreativeInventoryAction()`
- `public C10PacketCreativeInventoryAction(int slotIdIn, ItemStack stackIn)`

## Methods

- `public void processPacket( INetHandlerPlayServer handler)`
- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public int getSlotId()`
- `public ItemStack getStack()`

## Description

Passes this Packet on to the NetHandler for processing.
