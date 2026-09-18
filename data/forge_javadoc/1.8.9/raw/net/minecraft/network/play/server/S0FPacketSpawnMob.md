---
title: "S0FPacketSpawnMob"
description: "Passes this Packet on to the NetHandler for processing."
package: "net/minecraft/network/play/server"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/play/server/S0FPacketSpawnMob.html"
sourceType: javadoc
---

# S0FPacketSpawnMob

## Class signature

```java
public class S0FPacketSpawnMob extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public S0FPacketSpawnMob()`
- `public S0FPacketSpawnMob( EntityLivingBase entityIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public java.util.List< DataWatcher.WatchableObject > func_149027_c()`
- `public int getEntityID()`
- `public int getEntityType()`
- `public int getX()`
- `public int getY()`
- `public int getZ()`
- `public int getVelocityX()`
- `public int getVelocityY()`
- `public int getVelocityZ()`
- `public byte getYaw()`
- `public byte getPitch()`
- `public byte getHeadPitch()`

## Description

Passes this Packet on to the NetHandler for processing.
