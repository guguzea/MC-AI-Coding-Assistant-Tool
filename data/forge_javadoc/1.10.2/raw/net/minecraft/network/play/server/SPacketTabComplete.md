---
title: "SPacketTabComplete"
description: "public class SPacketTabComplete extends java.lang.Object implements Packet<INetHandlerPlayClient>"
package: "net/minecraft/network/play/server"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/network/play/server/SPacketTabComplete.html"
sourceType: javadoc
---

# SPacketTabComplete

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketTabComplete

## Class signature

```java
public class SPacketTabComplete extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketTabComplete()`
- `SPacketTabComplete(java.lang.String[] matchesIn)`

## Methods

- `java.lang.String[] getMatches()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`
