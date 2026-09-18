---
title: "S24PacketBlockAction"
description: "instrument data for noteblocks"
package: "net/minecraft/network/play/server"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/play/server/S24PacketBlockAction.html"
sourceType: javadoc
---

# S24PacketBlockAction

## Class signature

```java
public class S24PacketBlockAction extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public S24PacketBlockAction()`
- `public S24PacketBlockAction( BlockPos blockPositionIn, Block blockIn, int instrumentIn, int pitchIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public BlockPos getBlockPosition()`
- `public int getData1()`
- `public int getData2()`
- `public Block getBlockType()`

## Description

instrument data for noteblocks
