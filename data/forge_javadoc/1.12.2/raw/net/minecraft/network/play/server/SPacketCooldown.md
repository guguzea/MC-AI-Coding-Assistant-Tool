---
title: "SPacketCooldown"
description: "public class SPacketCooldown extends java.lang.Object implements Packet<INetHandlerPlayClient>"
package: "net/minecraft/network/play/server"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/network/play/server/SPacketCooldown.html"
sourceType: javadoc
---

# SPacketCooldown

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketCooldown

## Class signature

```java
public class SPacketCooldown extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketCooldown()`
- `SPacketCooldown(Item itemIn, int ticksIn)`

## Methods

- `Item getItem()`
- `int getTicks()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`
