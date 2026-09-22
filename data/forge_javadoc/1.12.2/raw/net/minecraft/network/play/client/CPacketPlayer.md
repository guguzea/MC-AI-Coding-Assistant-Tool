---
title: "CPacketPlayer"
description: "public class CPacketPlayer extends java.lang.Object implements Packet<INetHandlerPlayServer>"
package: "net/minecraft/network/play/client"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/network/play/client/CPacketPlayer.html"
sourceType: javadoc
---

# CPacketPlayer

**Inheritance:** java.lang.Object → net.minecraft.network.play.client.CPacketPlayer

## Class signature

```java
public class CPacketPlayer extends java.lang.Object implements Packet<INetHandlerPlayServer>
```

## Constructors

- `CPacketPlayer()`
- `CPacketPlayer(boolean onGroundIn)`

## Methods

- `float getPitch(float defaultValue)`
- `double getX(double defaultValue)`
- `double getY(double defaultValue)`
- `float getYaw(float defaultValue)`
- `double getZ(double defaultValue)`
- `boolean isOnGround()`
- `void processPacket(INetHandlerPlayServer handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`

## Fields

- `protected boolean moving`
- `protected boolean onGround`
- `protected float pitch`
- `protected boolean rotating`
- `protected double x`
- `protected double y`
- `protected float yaw`
- `protected double z`
