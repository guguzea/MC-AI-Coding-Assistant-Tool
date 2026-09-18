---
title: "SPacketOpenWindow"
description: "public class SPacketOpenWindow extends java.lang.Object implements Packet < INetHandlerPlayClient >"
package: "net/minecraft/network/play/server"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/network/play/server/SPacketOpenWindow.html"
sourceType: javadoc
---

# SPacketOpenWindow

## Class signature

```java
public class SPacketOpenWindow extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketOpenWindow()`
- `public SPacketOpenWindow(int windowIdIn, java.lang.String inventoryTypeIn, ITextComponent windowTitleIn)`
- `public SPacketOpenWindow(int windowIdIn, java.lang.String inventoryTypeIn, ITextComponent windowTitleIn, int slotCountIn)`
- `public SPacketOpenWindow(int windowIdIn, java.lang.String inventoryTypeIn, ITextComponent windowTitleIn, int slotCountIn, int entityIdIn)`

## Methods

- `public void processPacket( INetHandlerPlayClient handler)`
- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public int getWindowId()`
- `public java.lang.String getGuiId()`
- `public ITextComponent getWindowTitle()`
- `public int getSlotCount()`
- `public int getEntityId()`
- `public boolean hasSlots()`
