---
title: "SPacketHeldItemChange"
description: "public class SPacketHeldItemChange extends java.lang.Object implements Packet < INetHandlerPlayClient >"
package: "net/minecraft/network/play/server"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/network/play/server/SPacketHeldItemChange.html"
sourceType: javadoc
---

# SPacketHeldItemChange

## Class signature

```java
public class SPacketHeldItemChange extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketHeldItemChange()`
- `public SPacketHeldItemChange(int hotbarIndexIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public int getHeldItemHotbarIndex()`
