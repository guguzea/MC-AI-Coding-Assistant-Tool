---
title: "SPacketExplosion"
description: "public class SPacketExplosion extends java.lang.Object implements Packet < INetHandlerPlayClient >"
package: "net/minecraft/network/play/server"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/network/play/server/SPacketExplosion.html"
sourceType: javadoc
---

# SPacketExplosion

## Class signature

```java
public class SPacketExplosion extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketExplosion()`
- `public SPacketExplosion(double xIn, double yIn, double zIn, float strengthIn, java.util.List< BlockPos > affectedBlockPositionsIn, Vec3d motion)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public float getMotionX()`
- `public float getMotionY()`
- `public float getMotionZ()`
- `public double getX()`
- `public double getY()`
- `public double getZ()`
- `public float getStrength()`
- `public java.util.List< BlockPos > getAffectedBlockPositions()`
