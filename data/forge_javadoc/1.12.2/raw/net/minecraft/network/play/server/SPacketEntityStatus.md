---
title: "SPacketEntityStatus"
description: "public class SPacketEntityStatus extends java.lang.Object implements Packet<INetHandlerPlayClient>"
package: "net/minecraft/network/play/server"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/network/play/server/SPacketEntityStatus.html"
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
