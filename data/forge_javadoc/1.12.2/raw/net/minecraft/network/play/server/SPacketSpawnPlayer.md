---
title: "SPacketSpawnPlayer"
description: "public class SPacketSpawnPlayer extends java.lang.Object implements Packet<INetHandlerPlayClient>"
package: "net/minecraft/network/play/server"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/network/play/server/SPacketSpawnPlayer.html"
sourceType: javadoc
---

# SPacketSpawnPlayer

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketSpawnPlayer

## Class signature

```java
public class SPacketSpawnPlayer extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketSpawnPlayer()`
- `SPacketSpawnPlayer(EntityPlayer player)`

## Methods

- `java.util.List<EntityDataManager.DataEntry<?>> getDataManagerEntries()`
- `int getEntityID()`
- `byte getPitch()`
- `java.util.UUID getUniqueId()`
- `double getX()`
- `double getY()`
- `byte getYaw()`
- `double getZ()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`
