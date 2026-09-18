---
title: "C09PacketHeldItemChange"
description: "Passes this Packet on to the NetHandler for processing."
package: "net/minecraft/network/play/client"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/play/client/C09PacketHeldItemChange.html"
sourceType: javadoc
---

# C09PacketHeldItemChange

## Class signature

```java
public class C09PacketHeldItemChange extends java.lang.Object implements Packet < INetHandlerPlayServer >
```

## Constructors

- `public C09PacketHeldItemChange()`
- `public C09PacketHeldItemChange(int slotId)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayServer handler)`
- `public int getSlotId()`

## Description

Passes this Packet on to the NetHandler for processing.
