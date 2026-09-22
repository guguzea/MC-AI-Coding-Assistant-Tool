---
title: "S23PacketBlockChange"
description: "public class S23PacketBlockChange extends java.lang.Object implements Packet<INetHandlerPlayClient>"
package: "net/minecraft/network/play/server"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/play/server/S23PacketBlockChange.html"
sourceType: javadoc
---

# S23PacketBlockChange

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.S23PacketBlockChange

## Class signature

```java
public class S23PacketBlockChange extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `S23PacketBlockChange()`
- `S23PacketBlockChange(World worldIn, BlockPos blockPositionIn)`

## Methods

- `BlockPos getBlockPosition()`
- `IBlockState getBlockState()`
- `void processPacket(INetHandlerPlayClient handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.

## Fields

- `IBlockState blockState`
