---
title: "SPacketEntityHeadLook"
description: "public class SPacketEntityHeadLook extends java.lang.Object implements Packet<INetHandlerPlayClient>"
package: "net/minecraft/network/play/server"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/network/play/server/SPacketEntityHeadLook.html"
sourceType: javadoc
---

# SPacketEntityHeadLook

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketEntityHeadLook

## Class signature

```java
public class SPacketEntityHeadLook extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketEntityHeadLook()`
- `SPacketEntityHeadLook(Entity entityIn, byte yawIn)`

## Methods

- `Entity getEntity(World worldIn)`
- `byte getYaw()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`
