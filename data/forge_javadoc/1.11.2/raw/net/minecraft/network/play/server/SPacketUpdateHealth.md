---
title: "SPacketUpdateHealth"
description: "public class SPacketUpdateHealth extends java.lang.Object implements Packet < INetHandlerPlayClient >"
package: "net/minecraft/network/play/server"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/network/play/server/SPacketUpdateHealth.html"
sourceType: javadoc
---

# SPacketUpdateHealth

## Class signature

```java
public class SPacketUpdateHealth extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketUpdateHealth()`
- `public SPacketUpdateHealth(float healthIn, int foodLevelIn, float saturationLevelIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public float getHealth()`
- `public int getFoodLevel()`
- `public float getSaturationLevel()`
