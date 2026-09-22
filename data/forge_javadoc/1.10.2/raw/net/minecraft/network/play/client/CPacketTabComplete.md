---
title: "CPacketTabComplete"
description: "public class CPacketTabComplete extends java.lang.Object implements Packet<INetHandlerPlayServer>"
package: "net/minecraft/network/play/client"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/network/play/client/CPacketTabComplete.html"
sourceType: javadoc
---

# CPacketTabComplete

**Inheritance:** java.lang.Object → net.minecraft.network.play.client.CPacketTabComplete

## Class signature

```java
public class CPacketTabComplete extends java.lang.Object implements Packet<INetHandlerPlayServer>
```

## Constructors

- `CPacketTabComplete()`
- `CPacketTabComplete(java.lang.String messageIn, BlockPos targetBlockIn, boolean hasTargetBlockIn)`

## Methods

- `java.lang.String getMessage()`
- `BlockPos getTargetBlock()`
- `boolean hasTargetBlock()`
- `void processPacket(INetHandlerPlayServer handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`
