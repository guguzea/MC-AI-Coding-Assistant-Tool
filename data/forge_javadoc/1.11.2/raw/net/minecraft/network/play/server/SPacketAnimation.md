---
title: "SPacketAnimation"
description: "public class SPacketAnimation extends java.lang.Object implements Packet < INetHandlerPlayClient >"
package: "net/minecraft/network/play/server"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/network/play/server/SPacketAnimation.html"
sourceType: javadoc
---

# SPacketAnimation

## Class signature

```java
public class SPacketAnimation extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketAnimation()`
- `public SPacketAnimation( Entity entityIn, int typeIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public int getEntityID()`
- `public int getAnimationType()`
