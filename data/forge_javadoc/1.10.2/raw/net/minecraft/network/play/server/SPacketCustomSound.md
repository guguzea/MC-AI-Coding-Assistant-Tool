---
title: "SPacketCustomSound"
description: "public class SPacketCustomSound extends java.lang.Object implements Packet<INetHandlerPlayClient>"
package: "net/minecraft/network/play/server"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/network/play/server/SPacketCustomSound.html"
sourceType: javadoc
---

# SPacketCustomSound

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketCustomSound

## Class signature

```java
public class SPacketCustomSound extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketCustomSound()`
- `SPacketCustomSound(java.lang.String soundNameIn, SoundCategory categoryIn, double xIn, double yIn, double zIn, float volumeIn, float pitchIn)`

## Methods

- `SoundCategory getCategory()`
- `float getPitch()`
- `java.lang.String getSoundName()`
- `float getVolume()`
- `double getX()`
- `double getY()`
- `double getZ()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`
