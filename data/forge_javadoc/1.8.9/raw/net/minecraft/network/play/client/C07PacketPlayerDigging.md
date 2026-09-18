---
title: "C07PacketPlayerDigging"
description: "Passes this Packet on to the NetHandler for processing."
package: "net/minecraft/network/play/client"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/play/client/C07PacketPlayerDigging.html"
sourceType: javadoc
---

# C07PacketPlayerDigging

## Class signature

```java
public class C07PacketPlayerDigging extends java.lang.Object implements Packet < INetHandlerPlayServer >
```

## Constructors

- `public C07PacketPlayerDigging()`
- `public C07PacketPlayerDigging( C07PacketPlayerDigging.Action statusIn, BlockPos posIn, EnumFacing facingIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayServer handler)`
- `public BlockPos getPosition()`
- `public EnumFacing getFacing()`
- `public C07PacketPlayerDigging.Action getStatus()`

## Description

Passes this Packet on to the NetHandler for processing.
