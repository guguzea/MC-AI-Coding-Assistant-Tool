---
title: "SPacketEffect"
description: "public class SPacketEffect extends java.lang.Object implements Packet<INetHandlerPlayClient>"
package: "net/minecraft/network/play/server"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/network/play/server/SPacketEffect.html"
sourceType: javadoc
---

# SPacketEffect

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketEffect

## Class signature

```java
public class SPacketEffect extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketEffect()`
- `SPacketEffect(int soundTypeIn, BlockPos soundPosIn, int soundDataIn, boolean serverWideIn)`

## Methods

- `int getSoundData()`
- `BlockPos getSoundPos()`
- `int getSoundType()`
- `boolean isSoundServerwide()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`
