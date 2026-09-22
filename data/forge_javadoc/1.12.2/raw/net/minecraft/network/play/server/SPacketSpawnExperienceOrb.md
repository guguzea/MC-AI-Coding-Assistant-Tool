---
title: "SPacketSpawnExperienceOrb"
description: "public class SPacketSpawnExperienceOrb extends java.lang.Object implements Packet<INetHandlerPlayClient>"
package: "net/minecraft/network/play/server"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/network/play/server/SPacketSpawnExperienceOrb.html"
sourceType: javadoc
---

# SPacketSpawnExperienceOrb

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketSpawnExperienceOrb

## Class signature

```java
public class SPacketSpawnExperienceOrb extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketSpawnExperienceOrb()`
- `SPacketSpawnExperienceOrb(EntityXPOrb orb)`

## Methods

- `int getEntityID()`
- `double getX()`
- `int getXPValue()`
- `double getY()`
- `double getZ()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`
