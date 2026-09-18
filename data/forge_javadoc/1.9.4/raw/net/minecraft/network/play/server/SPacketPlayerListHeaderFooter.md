---
title: "SPacketPlayerListHeaderFooter"
description: "public class SPacketPlayerListHeaderFooter extends java.lang.Object implements Packet < INetHandlerPlayClient >"
package: "net/minecraft/network/play/server"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/network/play/server/SPacketPlayerListHeaderFooter.html"
sourceType: javadoc
---

# SPacketPlayerListHeaderFooter

## Class signature

```java
public class SPacketPlayerListHeaderFooter extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketPlayerListHeaderFooter()`
- `public SPacketPlayerListHeaderFooter( ITextComponent headerIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public ITextComponent getHeader()`
- `public ITextComponent getFooter()`
