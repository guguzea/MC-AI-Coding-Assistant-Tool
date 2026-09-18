---
title: "SPacketWindowItems"
description: "public class SPacketWindowItems extends java.lang.Object implements Packet < INetHandlerPlayClient >"
package: "net/minecraft/network/play/server"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/network/play/server/SPacketWindowItems.html"
sourceType: javadoc
---

# SPacketWindowItems

## Class signature

```java
public class SPacketWindowItems extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketWindowItems()`
- `public SPacketWindowItems(int p_i47317_1_, NonNullList < ItemStack > p_i47317_2_)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public int getWindowId()`
- `public java.util.List< ItemStack > getItemStacks()`
