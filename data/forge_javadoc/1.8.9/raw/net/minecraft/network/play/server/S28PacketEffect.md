---
title: "S28PacketEffect"
description: "public class S28PacketEffect extends java.lang.Object implements Packet<INetHandlerPlayClient>"
package: "net/minecraft/network/play/server"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/play/server/S28PacketEffect.html"
sourceType: javadoc
---

# S28PacketEffect

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.S28PacketEffect

## Class signature

```java
public class S28PacketEffect extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `S28PacketEffect()`
- `S28PacketEffect(int soundTypeIn, BlockPos soundPosIn, int soundDataIn, boolean serverWideIn)`

## Methods

- `int getSoundData()`
- `BlockPos getSoundPos()`
- `int getSoundType()`
- `boolean isSoundServerwide()`
- `void processPacket(INetHandlerPlayClient handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.
