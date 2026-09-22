---
title: "SPacketExplosion"
description: "public class SPacketExplosion extends java.lang.Object implements Packet<INetHandlerPlayClient>"
package: "net/minecraft/network/play/server"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/network/play/server/SPacketExplosion.html"
sourceType: javadoc
---

# SPacketExplosion

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketExplosion

## Class signature

```java
public class SPacketExplosion extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketExplosion()`
- `SPacketExplosion(double xIn, double yIn, double zIn, float strengthIn, java.util.List<BlockPos> affectedBlockPositionsIn, Vec3d motion)`

## Methods

- `java.util.List<BlockPos> getAffectedBlockPositions()`
- `float getMotionX()`
- `float getMotionY()`
- `float getMotionZ()`
- `float getStrength()`
- `double getX()`
- `double getY()`
- `double getZ()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`
