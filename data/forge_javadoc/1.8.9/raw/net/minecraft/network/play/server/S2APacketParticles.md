---
title: "S2APacketParticles"
description: "public class S2APacketParticles extends java.lang.Object implements Packet<INetHandlerPlayClient>"
package: "net/minecraft/network/play/server"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/play/server/S2APacketParticles.html"
sourceType: javadoc
---

# S2APacketParticles

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.S2APacketParticles

## Class signature

```java
public class S2APacketParticles extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `S2APacketParticles()`
- `S2APacketParticles(EnumParticleTypes particleTypeIn, boolean longDistanceIn, float x, float y, float z, float xOffsetIn, float yOffset, float zOffset, float particleSpeedIn, int particleCountIn, int... particleArgumentsIn)`

## Methods

- `int[] getParticleArgs()` — Gets the particle arguments.
- `int getParticleCount()` — Gets the amount of particles to spawn
- `float getParticleSpeed()` — Gets the speed of the particle animation (used in client side rendering).
- `EnumParticleTypes getParticleType()`
- `double getXCoordinate()` — Gets the x coordinate to spawn the particle.
- `float getXOffset()` — Gets the x coordinate offset for the particle.
- `double getYCoordinate()` — Gets the y coordinate to spawn the particle.
- `float getYOffset()` — Gets the y coordinate offset for the particle.
- `double getZCoordinate()` — Gets the z coordinate to spawn the particle.
- `float getZOffset()` — Gets the z coordinate offset for the particle.
- `boolean isLongDistance()`
- `void processPacket(INetHandlerPlayClient handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.
