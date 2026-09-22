---
title: "SPacketResourcePackSend"
description: "public class SPacketResourcePackSend extends java.lang.Object implements Packet<INetHandlerPlayClient>"
package: "net/minecraft/network/play/server"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/network/play/server/SPacketResourcePackSend.html"
sourceType: javadoc
---

# SPacketResourcePackSend

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketResourcePackSend

## Class signature

```java
public class SPacketResourcePackSend extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketResourcePackSend()`
- `SPacketResourcePackSend(java.lang.String urlIn, java.lang.String hashIn)`

## Methods

- `java.lang.String getHash()`
- `java.lang.String getURL()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`
