---
title: "SPacketCamera"
description: "public class SPacketCamera extends java.lang.Object implements Packet<INetHandlerPlayClient>"
package: "net/minecraft/network/play/server"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/network/play/server/SPacketCamera.html"
sourceType: javadoc
---

# SPacketCamera

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketCamera

## Class signature

```java
public class SPacketCamera extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketCamera()`
- `SPacketCamera(Entity entityIn)`

## Methods

- `Entity getEntity(World worldIn)`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`

## Fields

- `int entityId`
