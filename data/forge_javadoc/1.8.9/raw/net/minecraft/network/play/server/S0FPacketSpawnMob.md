---
title: "S0FPacketSpawnMob"
description: "public class S0FPacketSpawnMob extends java.lang.Object implements Packet<INetHandlerPlayClient>"
package: "net/minecraft/network/play/server"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/play/server/S0FPacketSpawnMob.html"
sourceType: javadoc
---

# S0FPacketSpawnMob

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.S0FPacketSpawnMob

## Class signature

```java
public class S0FPacketSpawnMob extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `S0FPacketSpawnMob()`
- `S0FPacketSpawnMob(EntityLivingBase entityIn)`

## Methods

- `java.util.List<DataWatcher.WatchableObject> func_149027_c()`
- `int getEntityID()`
- `int getEntityType()`
- `byte getHeadPitch()`
- `byte getPitch()`
- `int getVelocityX()`
- `int getVelocityY()`
- `int getVelocityZ()`
- `int getX()`
- `int getY()`
- `byte getYaw()`
- `int getZ()`
- `void processPacket(INetHandlerPlayClient handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.
