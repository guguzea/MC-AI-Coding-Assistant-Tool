---
title: "SPacketWorldBorder"
description: "public class SPacketWorldBorder extends java.lang.Object implements Packet<INetHandlerPlayClient>"
package: "net/minecraft/network/play/server"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/network/play/server/SPacketWorldBorder.html"
sourceType: javadoc
---

# SPacketWorldBorder

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketWorldBorder

## Class signature

```java
public class SPacketWorldBorder extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketWorldBorder()`
- `SPacketWorldBorder(WorldBorder border, SPacketWorldBorder.Action actionIn)`

## Methods

- `void apply(WorldBorder border)`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`
