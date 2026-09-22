---
title: "S03PacketTimeUpdate"
description: "public class S03PacketTimeUpdate extends java.lang.Object implements Packet<INetHandlerPlayClient>"
package: "net/minecraft/network/play/server"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/play/server/S03PacketTimeUpdate.html"
sourceType: javadoc
---

# S03PacketTimeUpdate

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.S03PacketTimeUpdate

## Class signature

```java
public class S03PacketTimeUpdate extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `S03PacketTimeUpdate()`
- `S03PacketTimeUpdate(long totalWorldTimeIn, long totalTimeIn, boolean doDayLightCycle)`

## Methods

- `long getTotalWorldTime()`
- `long getWorldTime()`
- `void processPacket(INetHandlerPlayClient handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.
