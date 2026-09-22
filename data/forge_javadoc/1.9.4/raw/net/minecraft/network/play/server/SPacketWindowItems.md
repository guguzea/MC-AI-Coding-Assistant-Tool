---
title: "SPacketWindowItems"
description: "public class SPacketWindowItems extends java.lang.Object implements Packet<INetHandlerPlayClient>"
package: "net/minecraft/network/play/server"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/network/play/server/SPacketWindowItems.html"
sourceType: javadoc
---

# SPacketWindowItems

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketWindowItems

## Class signature

```java
public class SPacketWindowItems extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketWindowItems()`
- `SPacketWindowItems(int windowIdIn, java.util.List<ItemStack> stacks)`

## Methods

- `ItemStack [] getItemStacks()`
- `int getWindowId()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`
