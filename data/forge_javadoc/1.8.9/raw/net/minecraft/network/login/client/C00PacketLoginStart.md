---
title: "C00PacketLoginStart"
description: "public class C00PacketLoginStart extends java.lang.Object implements Packet<INetHandlerLoginServer>"
package: "net/minecraft/network/login/client"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/login/client/C00PacketLoginStart.html"
sourceType: javadoc
---

# C00PacketLoginStart

**Inheritance:** java.lang.Object → net.minecraft.network.login.client.C00PacketLoginStart

## Class signature

```java
public class C00PacketLoginStart extends java.lang.Object implements Packet<INetHandlerLoginServer>
```

## Constructors

- `C00PacketLoginStart()`
- `C00PacketLoginStart(GameProfile profileIn)`

## Methods

- `GameProfile getProfile()`
- `void processPacket(INetHandlerLoginServer handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.
