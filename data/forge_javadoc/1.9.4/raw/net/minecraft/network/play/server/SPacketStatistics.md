---
title: "SPacketStatistics"
description: "public class SPacketStatistics extends java.lang.Object implements Packet < INetHandlerPlayClient >"
package: "net/minecraft/network/play/server"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/network/play/server/SPacketStatistics.html"
sourceType: javadoc
---

# SPacketStatistics

## Class signature

```java
public class SPacketStatistics extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketStatistics()`
- `public SPacketStatistics(java.util.Map< StatBase ,java.lang.Integer> statisticMapIn)`

## Methods

- `public void processPacket( INetHandlerPlayClient handler)`
- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public java.util.Map< StatBase ,java.lang.Integer> getStatisticMap()`
