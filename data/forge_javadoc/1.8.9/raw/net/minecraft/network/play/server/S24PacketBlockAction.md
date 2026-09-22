---
title: "S24PacketBlockAction"
description: "public class S24PacketBlockAction extends java.lang.Object implements Packet<INetHandlerPlayClient>"
package: "net/minecraft/network/play/server"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/play/server/S24PacketBlockAction.html"
sourceType: javadoc
---

# S24PacketBlockAction

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.S24PacketBlockAction

## Class signature

```java
public class S24PacketBlockAction extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `S24PacketBlockAction()`
- `S24PacketBlockAction(BlockPos blockPositionIn, Block blockIn, int instrumentIn, int pitchIn)`

## Methods

- `BlockPos getBlockPosition()`
- `Block getBlockType()`
- `int getData1()` — instrument data for noteblocks
- `int getData2()` — pitch data for noteblocks
- `void processPacket(INetHandlerPlayClient handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.
