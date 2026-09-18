---
title: "CPacketUpdateSign"
description: "public class CPacketUpdateSign extends java.lang.Object implements Packet < INetHandlerPlayServer >"
package: "net/minecraft/network/play/client"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/network/play/client/CPacketUpdateSign.html"
sourceType: javadoc
---

# CPacketUpdateSign

## Class signature

```java
public class CPacketUpdateSign extends java.lang.Object implements Packet < INetHandlerPlayServer >
```

## Constructors

- `public CPacketUpdateSign()`
- `public CPacketUpdateSign( BlockPos posIn, ITextComponent [] linesIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayServer handler)`
- `public BlockPos getPosition()`
- `public java.lang.String[] getLines()`
