---
title: "SPacketScoreboardObjective"
description: "public class SPacketScoreboardObjective extends java.lang.Object implements Packet < INetHandlerPlayClient >"
package: "net/minecraft/network/play/server"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/network/play/server/SPacketScoreboardObjective.html"
sourceType: javadoc
---

# SPacketScoreboardObjective

## Class signature

```java
public class SPacketScoreboardObjective extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketScoreboardObjective()`
- `public SPacketScoreboardObjective( ScoreObjective objective, int actionIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public java.lang.String getObjectiveName()`
- `public java.lang.String getObjectiveValue()`
- `public int getAction()`
- `public IScoreCriteria.EnumRenderType getRenderType()`
