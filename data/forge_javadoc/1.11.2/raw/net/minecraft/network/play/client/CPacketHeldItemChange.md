---
title: "CPacketHeldItemChange"
description: "public class CPacketHeldItemChange extends java.lang.Object implements Packet<INetHandlerPlayServer>"
package: "net/minecraft/network/play/client"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/network/play/client/CPacketHeldItemChange.html"
sourceType: javadoc
---

# CPacketHeldItemChange

**Inheritance:** java.lang.Object → net.minecraft.network.play.client.CPacketHeldItemChange

## Class signature

```java
public class CPacketHeldItemChange extends java.lang.Object implements Packet<INetHandlerPlayServer>
```

## Constructors

- `CPacketHeldItemChange()`
- `CPacketHeldItemChange(int slotIdIn)`

## Methods

- `int getSlotId()`
- `void processPacket(INetHandlerPlayServer handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`
