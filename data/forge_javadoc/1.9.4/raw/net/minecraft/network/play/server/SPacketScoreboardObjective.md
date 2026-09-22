---
title: "SPacketScoreboardObjective"
description: "public class SPacketScoreboardObjective extends java.lang.Object implements Packet<INetHandlerPlayClient>"
package: "net/minecraft/network/play/server"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/network/play/server/SPacketScoreboardObjective.html"
sourceType: javadoc
---

# SPacketScoreboardObjective

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketScoreboardObjective

## Class signature

```java
public class SPacketScoreboardObjective extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketScoreboardObjective()`
- `SPacketScoreboardObjective(ScoreObjective objective, int actionIn)`

## Methods

- `int getAction()`
- `java.lang.String getObjectiveName()`
- `java.lang.String getObjectiveValue()`
- `IScoreCriteria.EnumRenderType getRenderType()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`
