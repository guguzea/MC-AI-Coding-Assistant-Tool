---
title: "SPacketSoundEffect"
description: "public class SPacketSoundEffect extends java.lang.Object implements Packet < INetHandlerPlayClient >"
package: "net/minecraft/network/play/server"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/network/play/server/SPacketSoundEffect.html"
sourceType: javadoc
---

# SPacketSoundEffect

## Class signature

```java
public class SPacketSoundEffect extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketSoundEffect()`
- `public SPacketSoundEffect( SoundEvent soundIn, SoundCategory categoryIn, double xIn, double yIn, double zIn, float volumeIn, float pitchIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public SoundEvent getSound()`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public SoundCategory getCategory()`
- `public double getX()`
- `public double getY()`
- `public double getZ()`
- `public float getVolume()`
- `public float getPitch()`
