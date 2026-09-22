---
title: "SPacketTitle"
description: "public class SPacketTitle extends java.lang.Object implements Packet<INetHandlerPlayClient>"
package: "net/minecraft/network/play/server"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/network/play/server/SPacketTitle.html"
sourceType: javadoc
---

# SPacketTitle

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.SPacketTitle

## Class signature

```java
public class SPacketTitle extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `SPacketTitle()`
- `SPacketTitle(int fadeInTimeIn, int displayTimeIn, int fadeOutTimeIn)`
- `SPacketTitle(SPacketTitle.Type typeIn, ITextComponent messageIn)`
- `SPacketTitle(SPacketTitle.Type typeIn, ITextComponent messageIn, int fadeInTimeIn, int displayTimeIn, int fadeOutTimeIn)`

## Methods

- `int getDisplayTime()`
- `int getFadeInTime()`
- `int getFadeOutTime()`
- `ITextComponent getMessage()`
- `SPacketTitle.Type getType()`
- `void processPacket(INetHandlerPlayClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`
