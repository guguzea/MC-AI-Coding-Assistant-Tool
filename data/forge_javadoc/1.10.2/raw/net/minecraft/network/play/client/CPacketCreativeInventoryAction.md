---
title: "CPacketCreativeInventoryAction"
description: "public class CPacketCreativeInventoryAction extends java.lang.Object implements Packet<INetHandlerPlayServer>"
package: "net/minecraft/network/play/client"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/network/play/client/CPacketCreativeInventoryAction.html"
sourceType: javadoc
---

# CPacketCreativeInventoryAction

**Inheritance:** java.lang.Object → net.minecraft.network.play.client.CPacketCreativeInventoryAction

## Class signature

```java
public class CPacketCreativeInventoryAction extends java.lang.Object implements Packet<INetHandlerPlayServer>
```

## Constructors

- `CPacketCreativeInventoryAction()`
- `CPacketCreativeInventoryAction(int slotIdIn, ItemStack stackIn)`

## Methods

- `int getSlotId()`
- `ItemStack getStack()`
- `void processPacket(INetHandlerPlayServer handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`
