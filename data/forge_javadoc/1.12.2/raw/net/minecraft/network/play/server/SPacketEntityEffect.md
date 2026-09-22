---
title: "SPacketEntityEffect"
description: "public class SPacketEntityEffect extends java.lang.Object implements Packet<INetHandlerPlayClient>"
package: "net/minecraft/network/play/server"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/network/play/server/SPacketEntityEffect.html"
sourceType: javadoc
---

# SPacketEntityEffect

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketEntityEffect

## Class signature

```java
public class SPacketEntityEffect extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketEntityEffect()`
- `SPacketEntityEffect(int entityIdIn, PotionEffect effect)`

## Methods

- `boolean doesShowParticles()`
- `byte getAmplifier()`
- `int getDuration()`
- `byte getEffectId()`
- `int getEntityId()`
- `boolean getIsAmbient()`
- `boolean isMaxDuration()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`
