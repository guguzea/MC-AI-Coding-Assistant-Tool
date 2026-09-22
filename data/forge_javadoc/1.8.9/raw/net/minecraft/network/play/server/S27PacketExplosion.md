---
title: "S27PacketExplosion"
description: "public class S27PacketExplosion extends java.lang.Object implements Packet<INetHandlerPlayClient>"
package: "net/minecraft/network/play/server"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/play/server/S27PacketExplosion.html"
sourceType: javadoc
---

# S27PacketExplosion

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.S27PacketExplosion

## Class signature

```java
public class S27PacketExplosion extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `S27PacketExplosion()`
- `S27PacketExplosion(double p_i45193_1_, double y, double z, float strengthIn, java.util.List<BlockPos> affectedBlocksIn, Vec3 p_i45193_9_)`

## Methods

- `float func_149144_d()`
- `float func_149147_e()`
- `float func_149149_c()`
- `java.util.List<BlockPos> getAffectedBlockPositions()`
- `float getStrength()`
- `double getX()`
- `double getY()`
- `double getZ()`
- `void processPacket(INetHandlerPlayClient handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.
