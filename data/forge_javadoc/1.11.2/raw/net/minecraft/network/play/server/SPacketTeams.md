---
title: "SPacketTeams"
description: "public class SPacketTeams extends java.lang.Object implements Packet < INetHandlerPlayClient >"
package: "net/minecraft/network/play/server"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/network/play/server/SPacketTeams.html"
sourceType: javadoc
---

# SPacketTeams

## Class signature

```java
public class SPacketTeams extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketTeams()`
- `public SPacketTeams( ScorePlayerTeam teamIn, int actionIn)`
- `public SPacketTeams( ScorePlayerTeam teamIn, java.util.Collection<java.lang.String> playersIn, int actionIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public java.lang.String getName()`
- `public java.lang.String getDisplayName()`
- `public java.lang.String getPrefix()`
- `public java.lang.String getSuffix()`
- `public java.util.Collection<java.lang.String> getPlayers()`
- `public int getAction()`
- `public int getFriendlyFlags()`
- `public int getColor()`
- `public java.lang.String getNameTagVisibility()`
- `public java.lang.String getCollisionRule()`
