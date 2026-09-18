---
title: "S47PacketPlayerListHeaderFooter"
description: "Passes this Packet on to the NetHandler for processing."
package: "net/minecraft/network/play/server"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/play/server/S47PacketPlayerListHeaderFooter.html"
sourceType: javadoc
---

# S47PacketPlayerListHeaderFooter

## Class signature

```java
public class S47PacketPlayerListHeaderFooter extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public S47PacketPlayerListHeaderFooter()`
- `public S47PacketPlayerListHeaderFooter( IChatComponent headerIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public IChatComponent getHeader()`
- `public IChatComponent getFooter()`

## Description

Passes this Packet on to the NetHandler for processing.
