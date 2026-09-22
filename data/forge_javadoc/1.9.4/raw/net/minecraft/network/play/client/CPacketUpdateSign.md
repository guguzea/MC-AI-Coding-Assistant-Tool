---
title: "CPacketUpdateSign"
description: "public class CPacketUpdateSign extends java.lang.Object implements Packet<INetHandlerPlayServer>"
package: "net/minecraft/network/play/client"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/network/play/client/CPacketUpdateSign.html"
sourceType: javadoc
---

# CPacketUpdateSign

**Inheritance:** java.lang.Object → net.minecraft.network.play.client.CPacketUpdateSign

## Class signature

```java
public class CPacketUpdateSign extends java.lang.Object implements Packet<INetHandlerPlayServer>
```

## Constructors

- `CPacketUpdateSign()`
- `CPacketUpdateSign(BlockPos posIn, ITextComponent [] linesIn)`

## Methods

- `java.lang.String[] getLines()`
- `BlockPos getPosition()`
- `void processPacket(INetHandlerPlayServer handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`
