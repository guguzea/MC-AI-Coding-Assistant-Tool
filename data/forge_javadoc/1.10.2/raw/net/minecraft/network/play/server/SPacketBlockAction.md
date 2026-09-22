---
title: "SPacketBlockAction"
description: "public class SPacketBlockAction extends java.lang.Object implements Packet<INetHandlerPlayClient>"
package: "net/minecraft/network/play/server"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/network/play/server/SPacketBlockAction.html"
sourceType: javadoc
---

# SPacketBlockAction

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketBlockAction

## Class signature

```java
public class SPacketBlockAction extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketBlockAction()`
- `SPacketBlockAction(BlockPos pos, Block blockIn, int instrumentIn, int pitchIn)`

## Methods

- `BlockPos getBlockPosition()`
- `Block getBlockType()`
- `int getData1()`
- `int getData2()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`
