---
title: "S3CPacketUpdateScore"
description: "public class S3CPacketUpdateScore extends java.lang.Object implements Packet<INetHandlerPlayClient>"
package: "net/minecraft/network/play/server"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/play/server/S3CPacketUpdateScore.html"
sourceType: javadoc
---

# S3CPacketUpdateScore

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.S3CPacketUpdateScore

## Class signature

```java
public class S3CPacketUpdateScore extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `S3CPacketUpdateScore()`
- `S3CPacketUpdateScore(Score scoreIn)`
- `S3CPacketUpdateScore(java.lang.String nameIn)`
- `S3CPacketUpdateScore(java.lang.String nameIn, ScoreObjective objectiveIn)`

## Methods

- `java.lang.String getObjectiveName()`
- `java.lang.String getPlayerName()`
- `S3CPacketUpdateScore.Action getScoreAction()`
- `int getScoreValue()`
- `void processPacket(INetHandlerPlayClient handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.
