---
title: "SPacketRemoveEntityEffect"
description: "public class SPacketRemoveEntityEffect extends java.lang.Object implements Packet<INetHandlerPlayClient>"
package: "net/minecraft/network/play/server"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/network/play/server/SPacketRemoveEntityEffect.html"
sourceType: javadoc
---

# SPacketRemoveEntityEffect

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketRemoveEntityEffect

## Class signature

```java
public class SPacketRemoveEntityEffect extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketRemoveEntityEffect()`
- `SPacketRemoveEntityEffect(int entityIdIn, Potion potionIn)`

## Methods

- `Entity getEntity(World worldIn)`
- `Potion getPotion()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`
