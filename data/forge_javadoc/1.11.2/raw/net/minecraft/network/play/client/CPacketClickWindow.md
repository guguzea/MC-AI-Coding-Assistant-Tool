---
title: "CPacketClickWindow"
description: "public class CPacketClickWindow extends java.lang.Object implements Packet<INetHandlerPlayServer>"
package: "net/minecraft/network/play/client"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/network/play/client/CPacketClickWindow.html"
sourceType: javadoc
---

# CPacketClickWindow

**Inheritance:** java.lang.Object → net.minecraft.network.play.client.CPacketClickWindow

## Class signature

```java
public class CPacketClickWindow extends java.lang.Object implements Packet<INetHandlerPlayServer>
```

## Constructors

- `CPacketClickWindow()`
- `CPacketClickWindow(int windowIdIn, int slotIdIn, int usedButtonIn, ClickType modeIn, ItemStack clickedItemIn, short actionNumberIn)`

## Methods

- `short getActionNumber()`
- `ItemStack getClickedItem()`
- `ClickType getClickType()`
- `int getSlotId()`
- `int getUsedButton()`
- `int getWindowId()`
- `void processPacket(INetHandlerPlayServer handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`
