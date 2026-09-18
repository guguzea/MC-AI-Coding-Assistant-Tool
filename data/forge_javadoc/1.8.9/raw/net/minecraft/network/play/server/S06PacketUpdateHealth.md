---
title: "S06PacketUpdateHealth"
description: "Passes this Packet on to the NetHandler for processing."
package: "net/minecraft/network/play/server"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/play/server/S06PacketUpdateHealth.html"
sourceType: javadoc
---

# S06PacketUpdateHealth

## Class signature

```java
public class S06PacketUpdateHealth extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public S06PacketUpdateHealth()`
- `public S06PacketUpdateHealth(float healthIn, int foodLevelIn, float saturationIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public float getHealth()`
- `public int getFoodLevel()`
- `public float getSaturationLevel()`

## Description

Passes this Packet on to the NetHandler for processing.
