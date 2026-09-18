---
title: "S33PacketUpdateSign"
description: "Passes this Packet on to the NetHandler for processing."
package: "net/minecraft/network/play/server"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/play/server/S33PacketUpdateSign.html"
sourceType: javadoc
---

# S33PacketUpdateSign

## Class signature

```java
public class S33PacketUpdateSign extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public S33PacketUpdateSign()`
- `public S33PacketUpdateSign( World worldIn, BlockPos blockPosIn, IChatComponent [] linesIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public BlockPos getPos()`
- `public IChatComponent [] getLines()`

## Description

Passes this Packet on to the NetHandler for processing.
