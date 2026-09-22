---
title: "S48PacketResourcePackSend"
description: "public class S48PacketResourcePackSend extends java.lang.Object implements Packet<INetHandlerPlayClient>"
package: "net/minecraft/network/play/server"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/play/server/S48PacketResourcePackSend.html"
sourceType: javadoc
---

# S48PacketResourcePackSend

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.S48PacketResourcePackSend

## Class signature

```java
public class S48PacketResourcePackSend extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `S48PacketResourcePackSend()`
- `S48PacketResourcePackSend(java.lang.String url, java.lang.String hash)`

## Methods

- `java.lang.String getHash()`
- `java.lang.String getURL()`
- `void processPacket(INetHandlerPlayClient handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.
