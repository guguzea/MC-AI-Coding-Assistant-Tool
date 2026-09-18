---
title: "SPacketWindowItems"
description: "public class SPacketWindowItems extends java.lang.Object implements Packet < INetHandlerPlayClient >"
package: "net/minecraft/network/play/server"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/network/play/server/SPacketWindowItems.html"
sourceType: javadoc
---

# SPacketWindowItems

## Class signature

```java
public class SPacketWindowItems extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketWindowItems()`
- `public SPacketWindowItems(int windowIdIn, java.util.List< ItemStack > stacks)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public int getWindowId()`
- `public ItemStack [] getItemStacks()`
