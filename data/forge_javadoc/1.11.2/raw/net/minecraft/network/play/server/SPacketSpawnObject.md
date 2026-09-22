---
title: "SPacketSpawnObject"
description: "public class SPacketSpawnObject extends java.lang.Object implements Packet<INetHandlerPlayClient>"
package: "net/minecraft/network/play/server"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/network/play/server/SPacketSpawnObject.html"
sourceType: javadoc
---

# SPacketSpawnObject

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketSpawnObject

## Class signature

```java
public class SPacketSpawnObject extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketSpawnObject()`
- `SPacketSpawnObject(Entity entityIn, int typeIn)`
- `SPacketSpawnObject(Entity entityIn, int typeIn, int dataIn)`
- `SPacketSpawnObject(Entity entityIn, int typeIn, int dataIn, BlockPos pos)`

## Methods

- `int getData()`
- `int getEntityID()`
- `int getPitch()`
- `int getSpeedX()`
- `int getSpeedY()`
- `int getSpeedZ()`
- `int getType()`
- `java.util.UUID getUniqueId()`
- `double getX()`
- `double getY()`
- `int getYaw()`
- `double getZ()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void setData(int dataIn)`
- `void setSpeedX(int newSpeedX)`
- `void setSpeedY(int newSpeedY)`
- `void setSpeedZ(int newSpeedZ)`
- `void writePacketData(PacketBuffer buf)`
