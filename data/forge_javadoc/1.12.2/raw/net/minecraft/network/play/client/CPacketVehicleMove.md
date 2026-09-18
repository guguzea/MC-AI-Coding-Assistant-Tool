---
title: "CPacketVehicleMove"
description: "public class CPacketVehicleMove extends java.lang.Object implements Packet < INetHandlerPlayServer >"
package: "net/minecraft/network/play/client"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/network/play/client/CPacketVehicleMove.html"
sourceType: javadoc
---

# CPacketVehicleMove

## Class signature

```java
public class CPacketVehicleMove extends java.lang.Object implements Packet < INetHandlerPlayServer >
```

## Constructors

- `public CPacketVehicleMove()`
- `public CPacketVehicleMove( Entity entityIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayServer handler)`
- `public double getX()`
- `public double getY()`
- `public double getZ()`
- `public float getYaw()`
- `public float getPitch()`
