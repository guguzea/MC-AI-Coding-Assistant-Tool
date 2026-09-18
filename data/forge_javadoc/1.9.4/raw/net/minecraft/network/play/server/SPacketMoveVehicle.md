---
title: "SPacketMoveVehicle"
description: "public class SPacketMoveVehicle extends java.lang.Object implements Packet < INetHandlerPlayClient >"
package: "net/minecraft/network/play/server"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/network/play/server/SPacketMoveVehicle.html"
sourceType: javadoc
---

# SPacketMoveVehicle

## Class signature

```java
public class SPacketMoveVehicle extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketMoveVehicle()`
- `public SPacketMoveVehicle( Entity entityIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public double getX()`
- `public double getY()`
- `public double getZ()`
- `public float getYaw()`
- `public float getPitch()`
