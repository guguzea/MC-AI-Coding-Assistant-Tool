---
title: "S36PacketSignEditorOpen"
description: "Passes this Packet on to the NetHandler for processing."
package: "net/minecraft/network/play/server"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/play/server/S36PacketSignEditorOpen.html"
sourceType: javadoc
---

# S36PacketSignEditorOpen

## Class signature

```java
public class S36PacketSignEditorOpen extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public S36PacketSignEditorOpen()`
- `public S36PacketSignEditorOpen( BlockPos signPositionIn)`

## Methods

- `public void processPacket( INetHandlerPlayClient handler)`
- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public BlockPos getSignPosition()`

## Description

Passes this Packet on to the NetHandler for processing.
