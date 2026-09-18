---
title: "SPacketDisplayObjective"
description: "public class SPacketDisplayObjective extends java.lang.Object implements Packet < INetHandlerPlayClient >"
package: "net/minecraft/network/play/server"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/network/play/server/SPacketDisplayObjective.html"
sourceType: javadoc
---

# SPacketDisplayObjective

## Class signature

```java
public class SPacketDisplayObjective extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketDisplayObjective()`
- `public SPacketDisplayObjective(int positionIn, ScoreObjective objective)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public int getPosition()`
- `public java.lang.String getName()`
