---
title: "C03PacketPlayer"
description: "Passes this Packet on to the NetHandler for processing."
package: "net/minecraft/network/play/client"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/play/client/C03PacketPlayer.html"
sourceType: javadoc
---

# C03PacketPlayer

## Class signature

```java
public class C03PacketPlayer extends java.lang.Object implements Packet < INetHandlerPlayServer >
```

## Constructors

- `public C03PacketPlayer()`
- `public C03PacketPlayer(boolean isOnGround)`

## Methods

- `public void processPacket( INetHandlerPlayServer handler)`
- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public double getPositionX()`
- `public double getPositionY()`
- `public double getPositionZ()`
- `public float getYaw()`
- `public float getPitch()`
- `public boolean isOnGround()`
- `public boolean isMoving()`
- `public boolean getRotating()`
- `public void setMoving(boolean isMoving)`

## Description

Passes this Packet on to the NetHandler for processing.
