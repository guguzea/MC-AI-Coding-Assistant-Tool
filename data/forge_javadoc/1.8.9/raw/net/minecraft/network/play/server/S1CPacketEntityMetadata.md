---
title: "S1CPacketEntityMetadata"
description: "Passes this Packet on to the NetHandler for processing."
package: "net/minecraft/network/play/server"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/play/server/S1CPacketEntityMetadata.html"
sourceType: javadoc
---

# S1CPacketEntityMetadata

## Class signature

```java
public class S1CPacketEntityMetadata extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public S1CPacketEntityMetadata()`
- `public S1CPacketEntityMetadata(int entityIdIn, DataWatcher p_i45217_2_, boolean p_i45217_3_)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public java.util.List< DataWatcher.WatchableObject > func_149376_c()`
- `public int getEntityId()`

## Description

Passes this Packet on to the NetHandler for processing.
