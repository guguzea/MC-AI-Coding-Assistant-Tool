---
title: "SPacketSpawnMob"
description: "public class SPacketSpawnMob extends java.lang.Object implements Packet<INetHandlerPlayClient>"
package: "net/minecraft/network/play/server"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/network/play/server/SPacketSpawnMob.html"
sourceType: javadoc
---

# SPacketSpawnMob

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketSpawnMob

## Class signature

```java
public class SPacketSpawnMob extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketSpawnMob()`
- `SPacketSpawnMob(EntityLivingBase entityIn)`

## Methods

- `java.util.List<EntityDataManager.DataEntry<?>> getDataManagerEntries()`
- `int getEntityID()`
- `int getEntityType()`
- `byte getHeadPitch()`
- `byte getPitch()`
- `java.util.UUID getUniqueId()`
- `int getVelocityX()`
- `int getVelocityY()`
- `int getVelocityZ()`
- `double getX()`
- `double getY()`
- `byte getYaw()`
- `double getZ()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`
