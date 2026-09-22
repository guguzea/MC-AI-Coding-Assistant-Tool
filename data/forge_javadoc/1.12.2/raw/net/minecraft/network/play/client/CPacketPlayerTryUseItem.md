---
title: "CPacketPlayerTryUseItem"
description: "public class CPacketPlayerTryUseItem extends java.lang.Object implements Packet<INetHandlerPlayServer>"
package: "net/minecraft/network/play/client"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/network/play/client/CPacketPlayerTryUseItem.html"
sourceType: javadoc
---

# CPacketPlayerTryUseItem

**Inheritance:** java.lang.Object → net.minecraft.network.play.client.CPacketPlayerTryUseItem

## Class signature

```java
public class CPacketPlayerTryUseItem extends java.lang.Object implements Packet<INetHandlerPlayServer>
```

## Constructors

- `CPacketPlayerTryUseItem()`
- `CPacketPlayerTryUseItem(EnumHand handIn)`

## Methods

- `EnumHand getHand()`
- `void processPacket(INetHandlerPlayServer handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`
