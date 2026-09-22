---
title: "SPacketUseBed"
description: "public class SPacketUseBed extends java.lang.Object implements Packet<INetHandlerPlayClient>"
package: "net/minecraft/network/play/server"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/network/play/server/SPacketUseBed.html"
sourceType: javadoc
---

# SPacketUseBed

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketUseBed

## Class signature

```java
public class SPacketUseBed extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketUseBed()`
- `SPacketUseBed(EntityPlayer player, BlockPos posIn)`

## Methods

- `BlockPos getBedPosition()`
- `EntityPlayer getPlayer(World worldIn)`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`
