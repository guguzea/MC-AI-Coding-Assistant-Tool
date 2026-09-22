---
title: "S39PacketPlayerAbilities"
description: "public class S39PacketPlayerAbilities extends java.lang.Object implements Packet<INetHandlerPlayClient>"
package: "net/minecraft/network/play/server"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/play/server/S39PacketPlayerAbilities.html"
sourceType: javadoc
---

# S39PacketPlayerAbilities

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.S39PacketPlayerAbilities

## Class signature

```java
public class S39PacketPlayerAbilities extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `S39PacketPlayerAbilities()`
- `S39PacketPlayerAbilities(PlayerCapabilities capabilities)`

## Methods

- `float getFlySpeed()`
- `float getWalkSpeed()`
- `boolean isAllowFlying()`
- `boolean isCreativeMode()`
- `boolean isFlying()`
- `boolean isInvulnerable()`
- `void processPacket(INetHandlerPlayClient handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void setAllowFlying(boolean isAllowFlying)`
- `void setCreativeMode(boolean isCreativeMode)`
- `void setFlying(boolean isFlying)`
- `void setFlySpeed(float flySpeedIn)`
- `void setInvulnerable(boolean isInvulnerable)`
- `void setWalkSpeed(float walkSpeedIn)`
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.
