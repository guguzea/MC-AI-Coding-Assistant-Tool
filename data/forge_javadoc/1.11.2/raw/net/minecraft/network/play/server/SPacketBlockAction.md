---
title: "SPacketBlockAction"
description: "public class SPacketBlockAction extends java.lang.Object implements Packet < INetHandlerPlayClient >"
package: "net/minecraft/network/play/server"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/network/play/server/SPacketBlockAction.html"
sourceType: javadoc
---

# SPacketBlockAction

## Class signature

```java
public class SPacketBlockAction extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketBlockAction()`
- `public SPacketBlockAction( BlockPos pos, Block blockIn, int instrumentIn, int pitchIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public BlockPos getBlockPosition()`
- `public int getData1()`
- `public int getData2()`
- `public Block getBlockType()`
