---
title: "S31PacketWindowProperty"
description: "public class S31PacketWindowProperty extends java.lang.Object implements Packet<INetHandlerPlayClient>"
package: "net/minecraft/network/play/server"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/play/server/S31PacketWindowProperty.html"
sourceType: javadoc
---

# S31PacketWindowProperty

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.S31PacketWindowProperty

## Class signature

```java
public class S31PacketWindowProperty extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `S31PacketWindowProperty()`
- `S31PacketWindowProperty(int windowIdIn, int varIndexIn, int varValueIn)`

## Methods

- `int getVarIndex()`
- `int getVarValue()`
- `int getWindowId()`
- `void processPacket(INetHandlerPlayClient handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.
