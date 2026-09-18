---
title: "S2APacketParticles"
description: "Gets the particle arguments."
package: "net/minecraft/network/play/server"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/play/server/S2APacketParticles.html"
sourceType: javadoc
---

# S2APacketParticles

## Class signature

```java
public class S2APacketParticles extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public S2APacketParticles()`
- `public S2APacketParticles( EnumParticleTypes particleTypeIn, boolean longDistanceIn, float x, float y, float z, float xOffsetIn, float yOffset, float zOffset, float particleSpeedIn, int particleCountIn, int... particleArgumentsIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public EnumParticleTypes getParticleType()`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public boolean isLongDistance()`
- `public double getXCoordinate()`
- `public double getYCoordinate()`
- `public double getZCoordinate()`
- `public float getXOffset()`
- `public float getYOffset()`
- `public float getZOffset()`
- `public float getParticleSpeed()`
- `public int getParticleCount()`
- `public int[] getParticleArgs()`

## Description

Gets the particle arguments.
