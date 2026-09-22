---
title: "SPacketKeepAlive"
description: "public class SPacketKeepAlive extends java.lang.Object implements Packet<INetHandlerPlayClient>"
package: "net/minecraft/network/play/server"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/network/play/server/SPacketKeepAlive.html"
sourceType: javadoc
---

# SPacketKeepAlive

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketKeepAlive

## Class signature

```java
public class SPacketKeepAlive extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketKeepAlive()`
- `SPacketKeepAlive(int idIn)`

## Methods

- `int getId()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`
