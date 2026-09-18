---
title: "S09PacketHeldItemChange"
description: "Passes this Packet on to the NetHandler for processing."
package: "net/minecraft/network/play/server"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/play/server/S09PacketHeldItemChange.html"
sourceType: javadoc
---

# S09PacketHeldItemChange

## Class signature

```java
public class S09PacketHeldItemChange extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public S09PacketHeldItemChange()`
- `public S09PacketHeldItemChange(int hotbarIndexIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public int getHeldItemHotbarIndex()`

## Description

Passes this Packet on to the NetHandler for processing.
