---
title: "SPacketDisplayObjective"
description: "public class SPacketDisplayObjective extends java.lang.Object implements Packet<INetHandlerPlayClient>"
package: "net/minecraft/network/play/server"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/network/play/server/SPacketDisplayObjective.html"
sourceType: javadoc
---

# SPacketDisplayObjective

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketDisplayObjective

## Class signature

```java
public class SPacketDisplayObjective extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketDisplayObjective()`
- `SPacketDisplayObjective(int positionIn, ScoreObjective objective)`

## Methods

- `java.lang.String getName()`
- `int getPosition()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`
