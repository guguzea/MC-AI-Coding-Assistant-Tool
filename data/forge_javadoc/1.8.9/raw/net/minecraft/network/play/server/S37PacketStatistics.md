---
title: "S37PacketStatistics"
description: "Passes this Packet on to the NetHandler for processing."
package: "net/minecraft/network/play/server"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/play/server/S37PacketStatistics.html"
sourceType: javadoc
---

# S37PacketStatistics

## Class signature

```java
public class S37PacketStatistics extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public S37PacketStatistics()`
- `public S37PacketStatistics(java.util.Map< StatBase ,java.lang.Integer> p_i45173_1_)`

## Methods

- `public void processPacket( INetHandlerPlayClient handler)`
- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public java.util.Map< StatBase ,java.lang.Integer> func_148974_c()`

## Description

Passes this Packet on to the NetHandler for processing.
