---
title: "CPacketClickWindow"
description: "public class CPacketClickWindow extends java.lang.Object implements Packet < INetHandlerPlayServer >"
package: "net/minecraft/network/play/client"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/network/play/client/CPacketClickWindow.html"
sourceType: javadoc
---

# CPacketClickWindow

## Class signature

```java
public class CPacketClickWindow extends java.lang.Object implements Packet < INetHandlerPlayServer >
```

## Constructors

- `public CPacketClickWindow()`
- `public CPacketClickWindow(int windowIdIn, int slotIdIn, int usedButtonIn, ClickType modeIn, ItemStack clickedItemIn, short actionNumberIn)`

## Methods

- `public void processPacket( INetHandlerPlayServer handler)`
- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public int getWindowId()`
- `public int getSlotId()`
- `public int getUsedButton()`
- `public short getActionNumber()`
- `public ItemStack getClickedItem()`
- `public ClickType getClickType()`
