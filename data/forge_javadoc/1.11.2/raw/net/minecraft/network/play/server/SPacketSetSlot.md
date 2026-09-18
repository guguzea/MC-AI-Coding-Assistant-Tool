---
title: "SPacketSetSlot"
description: "public class SPacketSetSlot extends java.lang.Object implements Packet < INetHandlerPlayClient >"
package: "net/minecraft/network/play/server"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/network/play/server/SPacketSetSlot.html"
sourceType: javadoc
---

# SPacketSetSlot

## Class signature

```java
public class SPacketSetSlot extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketSetSlot()`
- `public SPacketSetSlot(int windowIdIn, int slotIn, ItemStack itemIn)`

## Methods

- `public void processPacket( INetHandlerPlayClient handler)`
- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public int getWindowId()`
- `public int getSlot()`
- `public ItemStack getStack()`
