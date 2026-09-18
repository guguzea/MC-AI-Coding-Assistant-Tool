---
title: "S2FPacketSetSlot"
description: "Passes this Packet on to the NetHandler for processing."
package: "net/minecraft/network/play/server"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/play/server/S2FPacketSetSlot.html"
sourceType: javadoc
---

# S2FPacketSetSlot

## Class signature

```java
public class S2FPacketSetSlot extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public S2FPacketSetSlot()`
- `public S2FPacketSetSlot(int windowIdIn, int slotIn, ItemStack itemIn)`

## Methods

- `public void processPacket( INetHandlerPlayClient handler)`
- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public int func_149175_c()`
- `public int func_149173_d()`
- `public ItemStack func_149174_e()`

## Description

Passes this Packet on to the NetHandler for processing.
