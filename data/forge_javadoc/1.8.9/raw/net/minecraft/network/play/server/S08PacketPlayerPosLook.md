---
title: "S08PacketPlayerPosLook"
description: "Passes this Packet on to the NetHandler for processing."
package: "net/minecraft/network/play/server"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/play/server/S08PacketPlayerPosLook.html"
sourceType: javadoc
---

# S08PacketPlayerPosLook

## Class signature

```java
public class S08PacketPlayerPosLook extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public S08PacketPlayerPosLook()`
- `public S08PacketPlayerPosLook(double xIn, double yIn, double zIn, float yawIn, float pitchIn, java.util.Set< S08PacketPlayerPosLook.EnumFlags > p_i45993_9_)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public double getX()`
- `public double getY()`
- `public double getZ()`
- `public float getYaw()`
- `public float getPitch()`
- `public java.util.Set< S08PacketPlayerPosLook.EnumFlags > func_179834_f()`

## Description

Passes this Packet on to the NetHandler for processing.
