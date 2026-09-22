---
title: "SPacketStatistics"
description: "public class SPacketStatistics extends java.lang.Object implements Packet<INetHandlerPlayClient>"
package: "net/minecraft/network/play/server"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/network/play/server/SPacketStatistics.html"
sourceType: javadoc
---

# SPacketStatistics

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketStatistics

## Class signature

```java
public class SPacketStatistics extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketStatistics()`
- `SPacketStatistics(java.util.Map<StatBase, java.lang.Integer> statisticMapIn)`

## Methods

- `java.util.Map<StatBase, java.lang.Integer> getStatisticMap()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`
