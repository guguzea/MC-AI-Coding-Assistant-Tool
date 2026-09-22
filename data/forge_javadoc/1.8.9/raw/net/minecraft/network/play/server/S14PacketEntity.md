---
title: "S14PacketEntity"
description: "public class S14PacketEntity extends java.lang.Object implements Packet<INetHandlerPlayClient>"
package: "net/minecraft/network/play/server"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/play/server/S14PacketEntity.html"
sourceType: javadoc
---

# S14PacketEntity

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.S14PacketEntity

## Class signature

```java
public class S14PacketEntity extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `S14PacketEntity()`
- `S14PacketEntity(int entityIdIn)`

## Methods

- `boolean func_149060_h()`
- `byte func_149061_d()`
- `byte func_149062_c()`
- `byte func_149063_g()`
- `byte func_149064_e()`
- `byte func_149066_f()`
- `Entity getEntity(World worldIn)`
- `boolean getOnGround()`
- `void processPacket(INetHandlerPlayClient handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `java.lang.String toString()`
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.

## Fields

- `protected int entityId`
- `protected boolean field_149069_g`
- `protected boolean onGround`
- `protected byte pitch`
- `protected byte posX`
- `protected byte posY`
- `protected byte posZ`
- `protected byte yaw`
