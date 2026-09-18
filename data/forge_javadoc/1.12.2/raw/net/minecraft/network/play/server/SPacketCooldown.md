---
title: "SPacketCooldown"
description: "public class SPacketCooldown extends java.lang.Object implements Packet < INetHandlerPlayClient >"
package: "net/minecraft/network/play/server"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/network/play/server/SPacketCooldown.html"
sourceType: javadoc
---

# SPacketCooldown

## Class signature

```java
public class SPacketCooldown extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketCooldown()`
- `public SPacketCooldown( Item itemIn, int ticksIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public Item getItem()`
- `public int getTicks()`
