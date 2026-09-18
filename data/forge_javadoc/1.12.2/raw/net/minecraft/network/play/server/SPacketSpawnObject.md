---
title: "SPacketSpawnObject"
description: "public class SPacketSpawnObject extends java.lang.Object implements Packet < INetHandlerPlayClient >"
package: "net/minecraft/network/play/server"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/network/play/server/SPacketSpawnObject.html"
sourceType: javadoc
---

# SPacketSpawnObject

## Class signature

```java
public class SPacketSpawnObject extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketSpawnObject()`
- `public SPacketSpawnObject( Entity entityIn, int typeIn)`
- `public SPacketSpawnObject( Entity entityIn, int typeIn, int dataIn)`
- `public SPacketSpawnObject( Entity entityIn, int typeIn, int dataIn, BlockPos pos)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public int getEntityID()`
- `public void setSpeedX(int newSpeedX)`
- `public java.util.UUID getUniqueId()`
- `public void setSpeedY(int newSpeedY)`
- `public double getX()`
- `public void setSpeedZ(int newSpeedZ)`
- `public double getY()`
- `public double getZ()`
- `public int getSpeedX()`
- `public int getSpeedY()`
- `public int getSpeedZ()`
- `public int getPitch()`
- `public int getYaw()`
- `public int getType()`
- `public int getData()`
- `public void setData(int dataIn)`
