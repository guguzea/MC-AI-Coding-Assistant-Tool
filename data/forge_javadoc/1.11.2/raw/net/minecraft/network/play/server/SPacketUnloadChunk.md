---
title: "SPacketUnloadChunk"
description: "public class SPacketUnloadChunk extends java.lang.Object implements Packet<INetHandlerPlayClient>"
package: "net/minecraft/network/play/server"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/network/play/server/SPacketUnloadChunk.html"
sourceType: javadoc
---

# SPacketUnloadChunk

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketUnloadChunk

## Class signature

```java
public class SPacketUnloadChunk extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketUnloadChunk()`
- `SPacketUnloadChunk(int xIn, int zIn)`

## Methods

- `int getX()`
- `int getZ()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`
