---
title: "CPacketEnchantItem"
description: "public class CPacketEnchantItem extends java.lang.Object implements Packet<INetHandlerPlayServer>"
package: "net/minecraft/network/play/client"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/network/play/client/CPacketEnchantItem.html"
sourceType: javadoc
---

# CPacketEnchantItem

**Inheritance:** java.lang.Object → net.minecraft.network.play.client.CPacketEnchantItem

## Class signature

```java
public class CPacketEnchantItem extends java.lang.Object implements Packet<INetHandlerPlayServer>
```

## Constructors

- `CPacketEnchantItem()`
- `CPacketEnchantItem(int windowIdIn, int buttonIn)`

## Methods

- `int getButton()`
- `int getWindowId()`
- `void processPacket(INetHandlerPlayServer handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`
