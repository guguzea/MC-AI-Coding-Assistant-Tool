---
title: "S0DPacketCollectItem"
description: "Passes this Packet on to the NetHandler for processing."
package: "net/minecraft/network/play/server"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/play/server/S0DPacketCollectItem.html"
sourceType: javadoc
---

# S0DPacketCollectItem

## Class signature

```java
public class S0DPacketCollectItem extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public S0DPacketCollectItem()`
- `public S0DPacketCollectItem(int collectedItemEntityIdIn, int entityIdIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public int getCollectedItemEntityID()`
- `public int getEntityID()`

## Description

Passes this Packet on to the NetHandler for processing.
