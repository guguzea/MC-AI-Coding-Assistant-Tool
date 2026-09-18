---
title: "CPacketTabComplete"
description: "public class CPacketTabComplete extends java.lang.Object implements Packet < INetHandlerPlayServer >"
package: "net/minecraft/network/play/client"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/network/play/client/CPacketTabComplete.html"
sourceType: javadoc
---

# CPacketTabComplete

## Class signature

```java
public class CPacketTabComplete extends java.lang.Object implements Packet < INetHandlerPlayServer >
```

## Constructors

- `public CPacketTabComplete()`
- `public CPacketTabComplete(java.lang.String messageIn, @Nullable BlockPos targetBlockIn, boolean hasTargetBlockIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayServer handler)`
- `public java.lang.String getMessage()`
- `@Nullable public BlockPos getTargetBlock()`
- `public boolean hasTargetBlock()`
