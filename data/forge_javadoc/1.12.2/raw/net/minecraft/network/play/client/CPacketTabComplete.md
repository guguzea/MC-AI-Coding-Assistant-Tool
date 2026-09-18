---
title: "CPacketTabComplete"
description: "public class CPacketTabComplete extends java.lang.Object implements Packet < INetHandlerPlayServer >"
package: "net/minecraft/network/play/client"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/network/play/client/CPacketTabComplete.html"
sourceType: javadoc
---

# CPacketTabComplete

## Class signature

```java
public class CPacketTabComplete extends java.lang.Object implements Packet < INetHandlerPlayServer >
```

## Constructors

- `public CPacketTabComplete()`
- `public CPacketTabComplete(java.lang.String messageIn, BlockPos targetBlockIn, boolean hasTargetBlockIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayServer handler)`
- `public java.lang.String getMessage()`
- `public BlockPos getTargetBlock()`
- `public boolean hasTargetBlock()`
