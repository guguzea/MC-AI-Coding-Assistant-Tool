---
title: "S2DPacketOpenWindow"
description: "Passes this Packet on to the NetHandler for processing."
package: "net/minecraft/network/play/server"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/play/server/S2DPacketOpenWindow.html"
sourceType: javadoc
---

# S2DPacketOpenWindow

## Class signature

```java
public class S2DPacketOpenWindow extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public S2DPacketOpenWindow()`
- `public S2DPacketOpenWindow(int incomingWindowId, java.lang.String incomingWindowTitle, IChatComponent windowTitleIn)`
- `public S2DPacketOpenWindow(int windowIdIn, java.lang.String guiId, IChatComponent windowTitleIn, int slotCountIn)`
- `public S2DPacketOpenWindow(int windowIdIn, java.lang.String guiId, IChatComponent windowTitleIn, int slotCountIn, int incomingEntityId)`

## Methods

- `public void processPacket( INetHandlerPlayClient handler)`
- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public int getWindowId()`
- `public java.lang.String getGuiId()`
- `public IChatComponent getWindowTitle()`
- `public int getSlotCount()`
- `public int getEntityId()`
- `public boolean hasSlots()`

## Description

Passes this Packet on to the NetHandler for processing.
