---
title: "CPacketCreativeInventoryAction"
description: "public class CPacketCreativeInventoryAction extends java.lang.Object implements Packet < INetHandlerPlayServer >"
package: "net/minecraft/network/play/client"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/network/play/client/CPacketCreativeInventoryAction.html"
sourceType: javadoc
---

# CPacketCreativeInventoryAction

## Class signature

```java
public class CPacketCreativeInventoryAction extends java.lang.Object implements Packet < INetHandlerPlayServer >
```

## Constructors

- `public CPacketCreativeInventoryAction()`
- `public CPacketCreativeInventoryAction(int slotIdIn, ItemStack stackIn)`

## Methods

- `public void processPacket( INetHandlerPlayServer handler)`
- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public int getSlotId()`
- `public ItemStack getStack()`
