---
title: "S48PacketResourcePackSend"
description: "Passes this Packet on to the NetHandler for processing."
package: "net/minecraft/network/play/server"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/play/server/S48PacketResourcePackSend.html"
sourceType: javadoc
---

# S48PacketResourcePackSend

## Class signature

```java
public class S48PacketResourcePackSend extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public S48PacketResourcePackSend()`
- `public S48PacketResourcePackSend(java.lang.String url, java.lang.String hash)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public java.lang.String getURL()`
- `public java.lang.String getHash()`

## Description

Passes this Packet on to the NetHandler for processing.
