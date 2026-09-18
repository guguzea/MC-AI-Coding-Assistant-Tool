---
title: "S30PacketWindowItems"
description: "Passes this Packet on to the NetHandler for processing."
package: "net/minecraft/network/play/server"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/play/server/S30PacketWindowItems.html"
sourceType: javadoc
---

# S30PacketWindowItems

## Class signature

```java
public class S30PacketWindowItems extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public S30PacketWindowItems()`
- `public S30PacketWindowItems(int windowIdIn, java.util.List< ItemStack > p_i45186_2_)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public int func_148911_c()`
- `public ItemStack [] getItemStacks()`

## Description

Passes this Packet on to the NetHandler for processing.
