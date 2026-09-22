---
title: "SPacketCollectItem"
description: "public class SPacketCollectItem extends java.lang.Object implements Packet<INetHandlerPlayClient>"
package: "net/minecraft/network/play/server"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/network/play/server/SPacketCollectItem.html"
sourceType: javadoc
---

# SPacketCollectItem

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketCollectItem

## Class signature

```java
public class SPacketCollectItem extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketCollectItem()`
- `SPacketCollectItem(int p_i47316_1_, int p_i47316_2_, int p_i47316_3_)`

## Methods

- `int getAmount()`
- `int getCollectedItemEntityID()`
- `int getEntityID()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`
