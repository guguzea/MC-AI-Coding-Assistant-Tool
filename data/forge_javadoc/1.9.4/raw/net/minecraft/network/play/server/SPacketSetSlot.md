---
title: "SPacketSetSlot"
description: "public class SPacketSetSlot extends java.lang.Object implements Packet<INetHandlerPlayClient>"
package: "net/minecraft/network/play/server"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/network/play/server/SPacketSetSlot.html"
sourceType: javadoc
---

# SPacketSetSlot

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketSetSlot

## Class signature

```java
public class SPacketSetSlot extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketSetSlot()`
- `SPacketSetSlot(int windowIdIn, int slotIn, ItemStack itemIn)`

## Methods

- `int getSlot()`
- `ItemStack getStack()`
- `int getWindowId()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`
