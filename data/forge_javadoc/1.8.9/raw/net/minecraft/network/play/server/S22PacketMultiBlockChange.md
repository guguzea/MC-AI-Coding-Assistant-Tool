---
title: "S22PacketMultiBlockChange"
description: "Passes this Packet on to the NetHandler for processing."
package: "net/minecraft/network/play/server"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/play/server/S22PacketMultiBlockChange.html"
sourceType: javadoc
---

# S22PacketMultiBlockChange

## Class signature

```java
public class S22PacketMultiBlockChange extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public S22PacketMultiBlockChange()`
- `public S22PacketMultiBlockChange(int p_i45181_1_, short[] crammedPositionsIn, Chunk chunkIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public S22PacketMultiBlockChange.BlockUpdateData [] getChangedBlocks()`

## Description

Passes this Packet on to the NetHandler for processing.
