---
title: "C0DPacketCloseWindow"
description: "public class C0DPacketCloseWindow extends java.lang.Object implements Packet<INetHandlerPlayServer>"
package: "net/minecraft/network/play/client"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/play/client/C0DPacketCloseWindow.html"
sourceType: javadoc
---

# C0DPacketCloseWindow

**Inheritance:** java.lang.Object → net.minecraft.network.play.client.C0DPacketCloseWindow

## Class signature

```java
public class C0DPacketCloseWindow extends java.lang.Object implements Packet<INetHandlerPlayServer>
```

## Constructors

- `C0DPacketCloseWindow()`
- `C0DPacketCloseWindow(int windowId)`

## Methods

- `void processPacket(INetHandlerPlayServer handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.
