---
title: "SPacketEntityVelocity"
description: "public class SPacketEntityVelocity extends java.lang.Object implements Packet < INetHandlerPlayClient >"
package: "net/minecraft/network/play/server"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/network/play/server/SPacketEntityVelocity.html"
sourceType: javadoc
---

# SPacketEntityVelocity

## Class signature

```java
public class SPacketEntityVelocity extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketEntityVelocity()`
- `public SPacketEntityVelocity( Entity entityIn)`
- `public SPacketEntityVelocity(int entityIdIn, double motionXIn, double motionYIn, double motionZIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public int getEntityID()`
- `public int getMotionX()`
- `public int getMotionY()`
- `public int getMotionZ()`
