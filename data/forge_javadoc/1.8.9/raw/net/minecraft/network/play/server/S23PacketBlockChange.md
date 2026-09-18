---
title: "S23PacketBlockChange"
description: "Passes this Packet on to the NetHandler for processing."
package: "net/minecraft/network/play/server"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/play/server/S23PacketBlockChange.html"
sourceType: javadoc
---

# S23PacketBlockChange

## Class signature

```java
public class S23PacketBlockChange extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public S23PacketBlockChange()`
- `public S23PacketBlockChange( World worldIn, BlockPos blockPositionIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public IBlockState getBlockState()`
- `public BlockPos getBlockPosition()`

## Description

Passes this Packet on to the NetHandler for processing.
