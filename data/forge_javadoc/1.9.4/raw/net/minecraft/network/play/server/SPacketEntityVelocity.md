---
title: "SPacketEntityVelocity"
description: "public class SPacketEntityVelocity extends java.lang.Object implements Packet<INetHandlerPlayClient>"
package: "net/minecraft/network/play/server"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/network/play/server/SPacketEntityVelocity.html"
sourceType: javadoc
---

# SPacketEntityVelocity

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketEntityVelocity

## Class signature

```java
public class SPacketEntityVelocity extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketEntityVelocity()`
- `SPacketEntityVelocity(Entity entityIn)`
- `SPacketEntityVelocity(int entityIdIn, double motionXIn, double motionYIn, double motionZIn)`

## Methods

- `int getEntityID()`
- `int getMotionX()`
- `int getMotionY()`
- `int getMotionZ()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`
