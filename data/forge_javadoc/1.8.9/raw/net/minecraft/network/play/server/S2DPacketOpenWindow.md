---
title: "S2DPacketOpenWindow"
description: "public class S2DPacketOpenWindow extends java.lang.Object implements Packet<INetHandlerPlayClient>"
package: "net/minecraft/network/play/server"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/play/server/S2DPacketOpenWindow.html"
sourceType: javadoc
---

# S2DPacketOpenWindow

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.S2DPacketOpenWindow

## Class signature

```java
public class S2DPacketOpenWindow extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `S2DPacketOpenWindow()`
- `S2DPacketOpenWindow(int incomingWindowId, java.lang.String incomingWindowTitle, IChatComponent windowTitleIn)`
- `S2DPacketOpenWindow(int windowIdIn, java.lang.String guiId, IChatComponent windowTitleIn, int slotCountIn)`
- `S2DPacketOpenWindow(int windowIdIn, java.lang.String guiId, IChatComponent windowTitleIn, int slotCountIn, int incomingEntityId)`

## Methods

- `int getEntityId()`
- `java.lang.String getGuiId()`
- `int getSlotCount()`
- `int getWindowId()`
- `IChatComponent getWindowTitle()`
- `boolean hasSlots()`
- `void processPacket(INetHandlerPlayClient handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.
