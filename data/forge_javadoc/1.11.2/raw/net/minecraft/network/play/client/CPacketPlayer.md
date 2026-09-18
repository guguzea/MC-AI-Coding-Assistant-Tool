---
title: "CPacketPlayer"
description: "public class CPacketPlayer extends java.lang.Object implements Packet < INetHandlerPlayServer >"
package: "net/minecraft/network/play/client"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/network/play/client/CPacketPlayer.html"
sourceType: javadoc
---

# CPacketPlayer

## Class signature

```java
public class CPacketPlayer extends java.lang.Object implements Packet < INetHandlerPlayServer >
```

## Constructors

- `public CPacketPlayer()`
- `public CPacketPlayer(boolean onGroundIn)`

## Methods

- `public void processPacket( INetHandlerPlayServer handler)`
- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public double getX(double defaultValue)`
- `public double getY(double defaultValue)`
- `public double getZ(double defaultValue)`
- `public float getYaw(float defaultValue)`
- `public float getPitch(float defaultValue)`
- `public boolean isOnGround()`
