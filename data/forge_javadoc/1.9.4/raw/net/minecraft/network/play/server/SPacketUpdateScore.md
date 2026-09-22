---
title: "SPacketUpdateScore"
description: "public class SPacketUpdateScore extends java.lang.Object implements Packet<INetHandlerPlayClient>"
package: "net/minecraft/network/play/server"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/network/play/server/SPacketUpdateScore.html"
sourceType: javadoc
---

# SPacketUpdateScore

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketUpdateScore

## Class signature

```java
public class SPacketUpdateScore extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketUpdateScore()`
- `SPacketUpdateScore(Score scoreIn)`
- `SPacketUpdateScore(java.lang.String nameIn)`
- `SPacketUpdateScore(java.lang.String nameIn, ScoreObjective objectiveIn)`

## Methods

- `java.lang.String getObjectiveName()`
- `java.lang.String getPlayerName()`
- `SPacketUpdateScore.Action getScoreAction()`
- `int getScoreValue()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`
