---
title: "SPacketWindowItems"
description: "public class SPacketWindowItems extends java.lang.Object implements Packet<INetHandlerPlayClient>"
package: "net/minecraft/network/play/server"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/network/play/server/SPacketWindowItems.html"
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
- `SPacketWindowItems(int p_i47317_1_, NonNullList<ItemStack> p_i47317_2_)`

## Methods

- `java.util.List<ItemStack> getItemStacks()`
- `int getWindowId()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`
