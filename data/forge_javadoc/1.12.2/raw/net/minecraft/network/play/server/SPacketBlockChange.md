---
title: "SPacketBlockChange"
description: "public class SPacketBlockChange extends java.lang.Object implements Packet<INetHandlerPlayClient>"
package: "net/minecraft/network/play/server"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/network/play/server/SPacketBlockChange.html"
sourceType: javadoc
---

# SPacketBlockChange

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketBlockChange

## Class signature

```java
public class SPacketBlockChange extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketBlockChange()`
- `SPacketBlockChange(World worldIn, BlockPos posIn)`

## Methods

- `BlockPos getBlockPosition()`
- `IBlockState getBlockState()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`

## Fields

- `IBlockState blockState`
