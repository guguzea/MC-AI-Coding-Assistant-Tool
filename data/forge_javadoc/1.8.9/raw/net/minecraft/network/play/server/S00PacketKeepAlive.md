---
title: "S00PacketKeepAlive"
description: "public class S00PacketKeepAlive extends java.lang.Object implements Packet<INetHandlerPlayClient>"
package: "net/minecraft/network/play/server"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/play/server/S00PacketKeepAlive.html"
sourceType: javadoc
---

# S00PacketKeepAlive

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.S00PacketKeepAlive

## Class signature

```java
public class S00PacketKeepAlive extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `S00PacketKeepAlive()`
- `S00PacketKeepAlive(int idIn)`

## Methods

- `int func_149134_c()`
- `void processPacket(INetHandlerPlayClient handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.
