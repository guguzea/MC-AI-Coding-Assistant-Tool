---
title: "SPacketPlayerPosLook"
description: "public class SPacketPlayerPosLook extends java.lang.Object implements Packet < INetHandlerPlayClient >"
package: "net/minecraft/network/play/server"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/network/play/server/SPacketPlayerPosLook.html"
sourceType: javadoc
---

# SPacketPlayerPosLook

## Class signature

```java
public class SPacketPlayerPosLook extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketPlayerPosLook()`
- `public SPacketPlayerPosLook(double xIn, double yIn, double zIn, float yawIn, float pitchIn, java.util.Set< SPacketPlayerPosLook.EnumFlags > flagsIn, int teleportIdIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public double getX()`
- `public double getY()`
- `public double getZ()`
- `public float getYaw()`
- `public float getPitch()`
- `public int getTeleportId()`
- `public java.util.Set< SPacketPlayerPosLook.EnumFlags > getFlags()`
