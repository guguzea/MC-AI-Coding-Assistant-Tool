---
title: "SPacketHeldItemChange"
description: "public class SPacketHeldItemChange extends java.lang.Object implements Packet<INetHandlerPlayClient>"
package: "net/minecraft/network/play/server"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/network/play/server/SPacketHeldItemChange.html"
sourceType: javadoc
---

# SPacketHeldItemChange

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketHeldItemChange

## Class signature

```java
public class SPacketHeldItemChange extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketHeldItemChange()`
- `SPacketHeldItemChange(int hotbarIndexIn)`

## Methods

- `int getHeldItemHotbarIndex()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`
