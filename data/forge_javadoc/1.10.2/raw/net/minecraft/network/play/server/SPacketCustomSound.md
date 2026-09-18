---
title: "SPacketCustomSound"
description: "public class SPacketCustomSound extends java.lang.Object implements Packet < INetHandlerPlayClient >"
package: "net/minecraft/network/play/server"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/network/play/server/SPacketCustomSound.html"
sourceType: javadoc
---

# SPacketCustomSound

## Class signature

```java
public class SPacketCustomSound extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketCustomSound()`
- `public SPacketCustomSound(java.lang.String soundNameIn, SoundCategory categoryIn, double xIn, double yIn, double zIn, float volumeIn, float pitchIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public java.lang.String getSoundName()`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public SoundCategory getCategory()`
- `public double getX()`
- `public double getY()`
- `public double getZ()`
- `public float getVolume()`
- `public float getPitch()`
