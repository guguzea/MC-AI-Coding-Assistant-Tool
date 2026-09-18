---
title: "S29PacketSoundEffect"
description: "Passes this Packet on to the NetHandler for processing."
package: "net/minecraft/network/play/server"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/play/server/S29PacketSoundEffect.html"
sourceType: javadoc
---

# S29PacketSoundEffect

## Class signature

```java
public class S29PacketSoundEffect extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public S29PacketSoundEffect()`
- `public S29PacketSoundEffect(java.lang.String soundNameIn, double soundX, double soundY, double soundZ, float volume, float pitch)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public java.lang.String getSoundName()`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public double getX()`
- `public double getY()`
- `public double getZ()`
- `public float getVolume()`
- `public float getPitch()`

## Description

Passes this Packet on to the NetHandler for processing.
