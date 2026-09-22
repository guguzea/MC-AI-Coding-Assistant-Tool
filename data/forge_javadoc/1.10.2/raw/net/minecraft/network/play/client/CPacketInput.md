---
title: "CPacketInput"
description: "public class CPacketInput extends java.lang.Object implements Packet<INetHandlerPlayServer>"
package: "net/minecraft/network/play/client"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/network/play/client/CPacketInput.html"
sourceType: javadoc
---

# CPacketInput

**Inheritance:** java.lang.Object → net.minecraft.network.play.client.CPacketInput

## Class signature

```java
public class CPacketInput extends java.lang.Object implements Packet<INetHandlerPlayServer>
```

## Constructors

- `CPacketInput()`
- `CPacketInput(float strafeSpeedIn, float forwardSpeedIn, boolean jumpingIn, boolean sneakingIn)`

## Methods

- `float getForwardSpeed()`
- `float getStrafeSpeed()`
- `boolean isJumping()`
- `boolean isSneaking()`
- `void processPacket(INetHandlerPlayServer handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`
