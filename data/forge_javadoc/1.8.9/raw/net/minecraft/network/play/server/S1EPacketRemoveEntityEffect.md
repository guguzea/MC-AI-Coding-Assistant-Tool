---
title: "S1EPacketRemoveEntityEffect"
description: "Passes this Packet on to the NetHandler for processing."
package: "net/minecraft/network/play/server"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/play/server/S1EPacketRemoveEntityEffect.html"
sourceType: javadoc
---

# S1EPacketRemoveEntityEffect

## Class signature

```java
public class S1EPacketRemoveEntityEffect extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public S1EPacketRemoveEntityEffect()`
- `public S1EPacketRemoveEntityEffect(int entityIdIn, PotionEffect effect)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public int getEntityId()`
- `public int getEffectId()`

## Description

Passes this Packet on to the NetHandler for processing.
