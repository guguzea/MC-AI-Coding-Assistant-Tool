---
title: "S31PacketWindowProperty"
description: "Passes this Packet on to the NetHandler for processing."
package: "net/minecraft/network/play/server"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/play/server/S31PacketWindowProperty.html"
sourceType: javadoc
---

# S31PacketWindowProperty

## Class signature

```java
public class S31PacketWindowProperty extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public S31PacketWindowProperty()`
- `public S31PacketWindowProperty(int windowIdIn, int varIndexIn, int varValueIn)`

## Methods

- `public void processPacket( INetHandlerPlayClient handler)`
- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public int getWindowId()`
- `public int getVarIndex()`
- `public int getVarValue()`

## Description

Passes this Packet on to the NetHandler for processing.
