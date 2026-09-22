---
title: "CPacketUseEntity"
description: "public class CPacketUseEntity extends java.lang.Object implements Packet<INetHandlerPlayServer>"
package: "net/minecraft/network/play/client"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/network/play/client/CPacketUseEntity.html"
sourceType: javadoc
---

# CPacketUseEntity

**Inheritance:** java.lang.Object → net.minecraft.network.play.client.CPacketUseEntity

## Class signature

```java
public class CPacketUseEntity extends java.lang.Object implements Packet<INetHandlerPlayServer>
```

## Constructors

- `CPacketUseEntity()`
- `CPacketUseEntity(Entity entityIn)`
- `CPacketUseEntity(Entity entityIn, EnumHand handIn)`
- `CPacketUseEntity(Entity entityIn, EnumHand handIn, Vec3d hitVecIn)`

## Methods

- `CPacketUseEntity.Action getAction()`
- `Entity getEntityFromWorld(World worldIn)`
- `EnumHand getHand()`
- `Vec3d getHitVec()`
- `void processPacket(INetHandlerPlayServer handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`
