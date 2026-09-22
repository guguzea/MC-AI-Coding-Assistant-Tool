---
title: "CPacketPlayerTryUseItemOnBlock"
description: "public class CPacketPlayerTryUseItemOnBlock extends java.lang.Object implements Packet<INetHandlerPlayServer>"
package: "net/minecraft/network/play/client"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/network/play/client/CPacketPlayerTryUseItemOnBlock.html"
sourceType: javadoc
---

# CPacketPlayerTryUseItemOnBlock

**Inheritance:** java.lang.Object → net.minecraft.network.play.client.CPacketPlayerTryUseItemOnBlock

## Class signature

```java
public class CPacketPlayerTryUseItemOnBlock extends java.lang.Object implements Packet<INetHandlerPlayServer>
```

## Constructors

- `CPacketPlayerTryUseItemOnBlock()`
- `CPacketPlayerTryUseItemOnBlock(BlockPos posIn, EnumFacing placedBlockDirectionIn, EnumHand handIn, float facingXIn, float facingYIn, float facingZIn)`

## Methods

- `EnumFacing getDirection()`
- `float getFacingX()`
- `float getFacingY()`
- `float getFacingZ()`
- `EnumHand getHand()`
- `BlockPos getPos()`
- `void processPacket(INetHandlerPlayServer handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`
