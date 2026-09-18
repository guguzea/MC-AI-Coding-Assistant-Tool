---
title: "S1DPacketEntityEffect"
description: "Passes this Packet on to the NetHandler for processing."
package: "net/minecraft/network/play/server"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/play/server/S1DPacketEntityEffect.html"
sourceType: javadoc
---

# S1DPacketEntityEffect

## Class signature

```java
public class S1DPacketEntityEffect extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public S1DPacketEntityEffect()`
- `public S1DPacketEntityEffect(int entityIdIn, PotionEffect effect)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public boolean func_149429_c()`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public int getEntityId()`
- `public byte getEffectId()`
- `public byte getAmplifier()`
- `public int getDuration()`
- `public boolean func_179707_f()`

## Description

Passes this Packet on to the NetHandler for processing.
