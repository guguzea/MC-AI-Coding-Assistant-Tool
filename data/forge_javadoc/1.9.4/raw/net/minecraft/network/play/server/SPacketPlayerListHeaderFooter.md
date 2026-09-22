---
title: "SPacketPlayerListHeaderFooter"
description: "public class SPacketPlayerListHeaderFooter extends java.lang.Object implements Packet<INetHandlerPlayClient>"
package: "net/minecraft/network/play/server"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/network/play/server/SPacketPlayerListHeaderFooter.html"
sourceType: javadoc
---

# SPacketPlayerListHeaderFooter

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketPlayerListHeaderFooter

## Class signature

```java
public class SPacketPlayerListHeaderFooter extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketPlayerListHeaderFooter()`
- `SPacketPlayerListHeaderFooter(ITextComponent headerIn)`

## Methods

- `ITextComponent getFooter()`
- `ITextComponent getHeader()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`
