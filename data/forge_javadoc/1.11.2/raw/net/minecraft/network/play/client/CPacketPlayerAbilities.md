---
title: "CPacketPlayerAbilities"
description: "public class CPacketPlayerAbilities extends java.lang.Object implements Packet<INetHandlerPlayServer>"
package: "net/minecraft/network/play/client"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/network/play/client/CPacketPlayerAbilities.html"
sourceType: javadoc
---

# CPacketPlayerAbilities

**Inheritance:** java.lang.Object → net.minecraft.network.play.client.CPacketPlayerAbilities

## Class signature

```java
public class CPacketPlayerAbilities extends java.lang.Object implements Packet<INetHandlerPlayServer>
```

## Constructors

- `CPacketPlayerAbilities()`
- `CPacketPlayerAbilities(PlayerCapabilities capabilities)`

## Methods

- `boolean isAllowFlying()`
- `boolean isCreativeMode()`
- `boolean isFlying()`
- `boolean isInvulnerable()`
- `void processPacket(INetHandlerPlayServer handler)`
- `void readPacketData(PacketBuffer buf)`
- `void setAllowFlying(boolean isAllowFlying)`
- `void setCreativeMode(boolean isCreativeMode)`
- `void setFlying(boolean isFlying)`
- `void setFlySpeed(float flySpeedIn)`
- `void setInvulnerable(boolean isInvulnerable)`
- `void setWalkSpeed(float walkSpeedIn)`
- `void writePacketData(PacketBuffer buf)`
