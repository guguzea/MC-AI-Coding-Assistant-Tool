---
title: "SPacketOpenWindow"
description: "public class SPacketOpenWindow extends java.lang.Object implements Packet<INetHandlerPlayClient>"
package: "net/minecraft/network/play/server"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/network/play/server/SPacketOpenWindow.html"
sourceType: javadoc
---

# SPacketOpenWindow

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketOpenWindow

## Class signature

```java
public class SPacketOpenWindow extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketOpenWindow()`
- `SPacketOpenWindow(int windowIdIn, java.lang.String inventoryTypeIn, ITextComponent windowTitleIn)`
- `SPacketOpenWindow(int windowIdIn, java.lang.String inventoryTypeIn, ITextComponent windowTitleIn, int slotCountIn)`
- `SPacketOpenWindow(int windowIdIn, java.lang.String inventoryTypeIn, ITextComponent windowTitleIn, int slotCountIn, int entityIdIn)`

## Methods

- `int getEntityId()`
- `java.lang.String getGuiId()`
- `int getSlotCount()`
- `int getWindowId()`
- `ITextComponent getWindowTitle()`
- `boolean hasSlots()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`
