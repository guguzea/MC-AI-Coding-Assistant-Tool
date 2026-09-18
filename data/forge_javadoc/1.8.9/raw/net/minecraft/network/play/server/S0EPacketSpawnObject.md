---
title: "S0EPacketSpawnObject"
description: "Passes this Packet on to the NetHandler for processing."
package: "net/minecraft/network/play/server"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/play/server/S0EPacketSpawnObject.html"
sourceType: javadoc
---

# S0EPacketSpawnObject

## Class signature

```java
public class S0EPacketSpawnObject extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public S0EPacketSpawnObject()`
- `public S0EPacketSpawnObject( Entity entityIn, int typeIn)`
- `public S0EPacketSpawnObject( Entity entityIn, int typeIn, int p_i45166_3_)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public int getEntityID()`
- `public void setX(int newX)`
- `public int getX()`
- `public void setY(int newY)`
- `public int getY()`
- `public void setZ(int newZ)`
- `public int getZ()`
- `public void setSpeedX(int newSpeedX)`
- `public int getSpeedX()`
- `public void setSpeedY(int newSpeedY)`
- `public int getSpeedY()`
- `public void setSpeedZ(int newSpeedZ)`
- `public int getSpeedZ()`
- `public int getPitch()`
- `public int getYaw()`
- `public int getType()`
- `public int func_149009_m()`
- `public void func_149002_g(int p_149002_1_)`

## Description

Passes this Packet on to the NetHandler for processing.
