---
title: "SPacketEntityHeadLook"
description: "public class SPacketEntityHeadLook extends java.lang.Object implements Packet < INetHandlerPlayClient >"
package: "net/minecraft/network/play/server"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/network/play/server/SPacketEntityHeadLook.html"
sourceType: javadoc
---

# SPacketEntityHeadLook

## Class signature

```java
public class SPacketEntityHeadLook extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketEntityHeadLook()`
- `public SPacketEntityHeadLook( Entity entityIn, byte yawIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public Entity getEntity( World worldIn)`
- `public byte getYaw()`
