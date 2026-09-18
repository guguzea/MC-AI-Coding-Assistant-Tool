---
title: "SPacketTitle"
description: "public class SPacketTitle extends java.lang.Object implements Packet < INetHandlerPlayClient >"
package: "net/minecraft/network/play/server"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/network/play/server/SPacketTitle.html"
sourceType: javadoc
---

# SPacketTitle

## Class signature

```java
public class SPacketTitle extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketTitle()`
- `public SPacketTitle( SPacketTitle.Type typeIn, ITextComponent messageIn)`
- `public SPacketTitle(int fadeInTimeIn, int displayTimeIn, int fadeOutTimeIn)`
- `public SPacketTitle( SPacketTitle.Type typeIn, ITextComponent messageIn, int fadeInTimeIn, int displayTimeIn, int fadeOutTimeIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public SPacketTitle.Type getType()`
- `public ITextComponent getMessage()`
- `public int getFadeInTime()`
- `public int getDisplayTime()`
- `public int getFadeOutTime()`
