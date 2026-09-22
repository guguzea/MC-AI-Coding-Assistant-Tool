---
title: "SPacketPlayerAbilities"
description: "public class SPacketPlayerAbilities extends java.lang.Object implements Packet<INetHandlerPlayClient>"
package: "net/minecraft/network/play/server"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/network/play/server/SPacketPlayerAbilities.html"
sourceType: javadoc
---

# SPacketPlayerAbilities

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketPlayerAbilities

## Class signature

```java
public class SPacketPlayerAbilities extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketPlayerAbilities()`
- `SPacketPlayerAbilities(PlayerCapabilities capabilities)`

## Methods

- `float getFlySpeed()`
- `float getWalkSpeed()`
- `boolean isAllowFlying()`
- `boolean isCreativeMode()`
- `boolean isFlying()`
- `boolean isInvulnerable()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void setAllowFlying(boolean isAllowFlying)`
- `void setCreativeMode(boolean isCreativeMode)`
- `void setFlying(boolean isFlying)`
- `void setFlySpeed(float flySpeedIn)`
- `void setInvulnerable(boolean isInvulnerable)`
- `void setWalkSpeed(float walkSpeedIn)`
- `void writePacketData(PacketBuffer buf)`
