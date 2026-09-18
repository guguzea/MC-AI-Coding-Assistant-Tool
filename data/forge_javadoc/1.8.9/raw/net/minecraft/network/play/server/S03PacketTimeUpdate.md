---
title: "S03PacketTimeUpdate"
description: "Passes this Packet on to the NetHandler for processing."
package: "net/minecraft/network/play/server"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/play/server/S03PacketTimeUpdate.html"
sourceType: javadoc
---

# S03PacketTimeUpdate

## Class signature

```java
public class S03PacketTimeUpdate extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public S03PacketTimeUpdate()`
- `public S03PacketTimeUpdate(long totalWorldTimeIn, long totalTimeIn, boolean doDayLightCycle)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public long getTotalWorldTime()`
- `public long getWorldTime()`

## Description

Passes this Packet on to the NetHandler for processing.
