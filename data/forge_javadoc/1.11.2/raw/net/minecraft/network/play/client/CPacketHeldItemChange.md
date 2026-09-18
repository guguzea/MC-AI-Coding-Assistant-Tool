---
title: "CPacketHeldItemChange"
description: "public class CPacketHeldItemChange extends java.lang.Object implements Packet < INetHandlerPlayServer >"
package: "net/minecraft/network/play/client"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/network/play/client/CPacketHeldItemChange.html"
sourceType: javadoc
---

# CPacketHeldItemChange

## Class signature

```java
public class CPacketHeldItemChange extends java.lang.Object implements Packet < INetHandlerPlayServer >
```

## Constructors

- `public CPacketHeldItemChange()`
- `public CPacketHeldItemChange(int slotIdIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayServer handler)`
- `public int getSlotId()`
