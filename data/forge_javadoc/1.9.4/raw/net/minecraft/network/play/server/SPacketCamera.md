---
title: "SPacketCamera"
description: "public class SPacketCamera extends java.lang.Object implements Packet < INetHandlerPlayClient >"
package: "net/minecraft/network/play/server"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/network/play/server/SPacketCamera.html"
sourceType: javadoc
---

# SPacketCamera

## Class signature

```java
public class SPacketCamera extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketCamera()`
- `public SPacketCamera( Entity entityIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `@Nullable public Entity getEntity( World worldIn)`
