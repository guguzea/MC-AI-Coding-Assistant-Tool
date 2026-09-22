---
title: "SPacketEntityStatus"
description: "public class SPacketEntityStatus extends java.lang.Object implements Packet<INetHandlerPlayClient>"
package: "net/minecraft/network/play/server"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/network/play/server/SPacketEntityStatus.html"
sourceType: javadoc
---

# SPacketEntityStatus

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketEntityStatus

## Class signature

```java
public class SPacketEntityStatus extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketEntityStatus()`
- `SPacketEntityStatus(Entity entityIn, byte opcodeIn)`

## Methods

- `Entity getEntity(World worldIn)`
- `byte getOpCode()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`
