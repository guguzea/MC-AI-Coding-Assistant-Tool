---
title: "C01PacketPing"
description: "public class C01PacketPing extends java.lang.Object implements Packet<INetHandlerStatusServer>"
package: "net/minecraft/network/status/client"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/status/client/C01PacketPing.html"
sourceType: javadoc
---

# C01PacketPing

**Inheritance:** java.lang.Object → net.minecraft.network.status.client.C01PacketPing

## Class signature

```java
public class C01PacketPing extends java.lang.Object implements Packet<INetHandlerStatusServer>
```

## Constructors

- `C01PacketPing()`
- `C01PacketPing(long ping)`

## Methods

- `long getClientTime()`
- `void processPacket(INetHandlerStatusServer handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.
