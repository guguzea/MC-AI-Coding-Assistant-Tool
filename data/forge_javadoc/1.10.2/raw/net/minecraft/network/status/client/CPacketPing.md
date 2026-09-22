---
title: "CPacketPing"
description: "public class CPacketPing extends java.lang.Object implements Packet<INetHandlerStatusServer>"
package: "net/minecraft/network/status/client"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/network/status/client/CPacketPing.html"
sourceType: javadoc
---

# CPacketPing

**Inheritance:** java.lang.Object → net.minecraft.network.status.client.CPacketPing

## Class signature

```java
public class CPacketPing extends java.lang.Object implements Packet<INetHandlerStatusServer>
```

## Constructors

- `CPacketPing()`
- `CPacketPing(long clientTimeIn)`

## Methods

- `long getClientTime()`
- `void processPacket(INetHandlerStatusServer handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`
