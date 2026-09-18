---
title: "SPacketUpdateScore"
description: "public class SPacketUpdateScore extends java.lang.Object implements Packet < INetHandlerPlayClient >"
package: "net/minecraft/network/play/server"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/network/play/server/SPacketUpdateScore.html"
sourceType: javadoc
---

# SPacketUpdateScore

## Class signature

```java
public class SPacketUpdateScore extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketUpdateScore()`
- `public SPacketUpdateScore( Score scoreIn)`
- `public SPacketUpdateScore(java.lang.String nameIn)`
- `public SPacketUpdateScore(java.lang.String nameIn, ScoreObjective objectiveIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public java.lang.String getPlayerName()`
- `public java.lang.String getObjectiveName()`
- `public int getScoreValue()`
- `public SPacketUpdateScore.Action getScoreAction()`
