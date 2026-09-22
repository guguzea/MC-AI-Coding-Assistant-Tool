---
title: "SPacketEntityTeleport"
description: "public class SPacketEntityTeleport extends java.lang.Object implements Packet<INetHandlerPlayClient>"
package: "net/minecraft/network/play/server"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/network/play/server/SPacketEntityTeleport.html"
sourceType: javadoc
---

# SPacketEntityTeleport

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketEntityTeleport

## Class signature

```java
public class SPacketEntityTeleport extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketEntityTeleport()`
- `SPacketEntityTeleport(Entity entityIn)`

## Methods

- `int getEntityId()`
- `boolean getOnGround()`
- `byte getPitch()`
- `double getX()`
- `double getY()`
- `byte getYaw()`
- `double getZ()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`
