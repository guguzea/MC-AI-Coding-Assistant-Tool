---
title: "SPacketMultiBlockChange"
description: "public class SPacketMultiBlockChange extends java.lang.Object implements Packet<INetHandlerPlayClient>"
package: "net/minecraft/network/play/server"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/network/play/server/SPacketMultiBlockChange.html"
sourceType: javadoc
---

# SPacketMultiBlockChange

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketMultiBlockChange

## Class signature

```java
public class SPacketMultiBlockChange extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketMultiBlockChange()`
- `SPacketMultiBlockChange(int p_i46959_1_, short[] p_i46959_2_, Chunk p_i46959_3_)`

## Methods

- `SPacketMultiBlockChange.BlockUpdateData [] getChangedBlocks()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`
