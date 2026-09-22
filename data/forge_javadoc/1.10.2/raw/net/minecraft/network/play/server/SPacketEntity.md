---
title: "SPacketEntity"
description: "public class SPacketEntity extends java.lang.Object implements Packet<INetHandlerPlayClient>"
package: "net/minecraft/network/play/server"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/network/play/server/SPacketEntity.html"
sourceType: javadoc
---

# SPacketEntity

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketEntity

## Class signature

```java
public class SPacketEntity extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketEntity()`
- `SPacketEntity(int entityIdIn)`

## Methods

- `Entity getEntity(World worldIn)`
- `boolean getOnGround()`
- `byte getPitch()`
- `int getX()`
- `int getY()`
- `byte getYaw()`
- `int getZ()`
- `boolean isRotating()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `java.lang.String toString()`
- `void writePacketData(PacketBuffer buf)`

## Fields

- `protected int entityId`
- `protected boolean onGround`
- `protected byte pitch`
- `protected int posX`
- `protected int posY`
- `protected int posZ`
- `protected boolean rotating`
- `protected byte yaw`
