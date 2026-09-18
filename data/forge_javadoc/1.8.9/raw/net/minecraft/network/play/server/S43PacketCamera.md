---
title: "S43PacketCamera"
description: "Passes this Packet on to the NetHandler for processing."
package: "net/minecraft/network/play/server"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/play/server/S43PacketCamera.html"
sourceType: javadoc
---

# S43PacketCamera

## Class signature

```java
public class S43PacketCamera extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public S43PacketCamera()`
- `public S43PacketCamera( Entity entityIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public Entity getEntity( World worldIn)`

## Description

Passes this Packet on to the NetHandler for processing.
