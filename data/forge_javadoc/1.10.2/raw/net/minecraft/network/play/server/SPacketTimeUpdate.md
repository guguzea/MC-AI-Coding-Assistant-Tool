---
title: "SPacketTimeUpdate"
description: "public class SPacketTimeUpdate extends java.lang.Object implements Packet<INetHandlerPlayClient>"
package: "net/minecraft/network/play/server"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/network/play/server/SPacketTimeUpdate.html"
sourceType: javadoc
---

# SPacketTimeUpdate

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketTimeUpdate

## Class signature

```java
public class SPacketTimeUpdate extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketTimeUpdate()`
- `SPacketTimeUpdate(long totalWorldTimeIn, long worldTimeIn, boolean p_i46902_5_)`

## Methods

- `long getTotalWorldTime()`
- `long getWorldTime()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`
