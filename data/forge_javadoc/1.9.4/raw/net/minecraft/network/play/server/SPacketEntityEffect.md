---
title: "SPacketEntityEffect"
description: "public class SPacketEntityEffect extends java.lang.Object implements Packet < INetHandlerPlayClient >"
package: "net/minecraft/network/play/server"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/network/play/server/SPacketEntityEffect.html"
sourceType: javadoc
---

# SPacketEntityEffect

## Class signature

```java
public class SPacketEntityEffect extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketEntityEffect()`
- `public SPacketEntityEffect(int entityIdIn, PotionEffect effect)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public boolean isMaxDuration()`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public int getEntityId()`
- `public byte getEffectId()`
- `public byte getAmplifier()`
- `public int getDuration()`
- `public boolean doesShowParticles()`
- `public boolean getIsAmbient()`
