---
title: "C08PacketPlayerBlockPlacement"
description: "Returns the offset from xPosition where the actual click took place."
package: "net/minecraft/network/play/client"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/play/client/C08PacketPlayerBlockPlacement.html"
sourceType: javadoc
---

# C08PacketPlayerBlockPlacement

## Class signature

```java
public class C08PacketPlayerBlockPlacement extends java.lang.Object implements Packet < INetHandlerPlayServer >
```

## Constructors

- `public C08PacketPlayerBlockPlacement()`
- `public C08PacketPlayerBlockPlacement( ItemStack stackIn)`
- `public C08PacketPlayerBlockPlacement( BlockPos positionIn, int placedBlockDirectionIn, ItemStack stackIn, float facingXIn, float facingYIn, float facingZIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayServer handler)`
- `public BlockPos getPosition()`
- `public int getPlacedBlockDirection()`
- `public ItemStack getStack()`
- `public float getPlacedBlockOffsetX()`
- `public float getPlacedBlockOffsetY()`
- `public float getPlacedBlockOffsetZ()`

## Description

Returns the offset from xPosition where the actual click took place.
