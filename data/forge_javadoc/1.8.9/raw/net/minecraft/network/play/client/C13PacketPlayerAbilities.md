---
title: "C13PacketPlayerAbilities"
description: "public class C13PacketPlayerAbilities extends java.lang.Object implements Packet<INetHandlerPlayServer>"
package: "net/minecraft/network/play/client"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/play/client/C13PacketPlayerAbilities.html"
sourceType: javadoc
---

# C13PacketPlayerAbilities

**Inheritance:** java.lang.Object → net.minecraft.network.play.client.C13PacketPlayerAbilities

## Class signature

```java
public class C13PacketPlayerAbilities extends java.lang.Object implements Packet<INetHandlerPlayServer>
```

## Constructors

- `C13PacketPlayerAbilities()`
- `C13PacketPlayerAbilities(PlayerCapabilities capabilities)`

## Methods

- `boolean isAllowFlying()`
- `boolean isCreativeMode()`
- `boolean isFlying()`
- `boolean isInvulnerable()`
- `void processPacket(INetHandlerPlayServer handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void setAllowFlying(boolean isAllowFlying)`
- `void setCreativeMode(boolean isCreativeMode)`
- `void setFlying(boolean isFlying)`
- `void setFlySpeed(float flySpeedIn)`
- `void setInvulnerable(boolean isInvulnerable)`
- `void setWalkSpeed(float walkSpeedIn)`
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.
