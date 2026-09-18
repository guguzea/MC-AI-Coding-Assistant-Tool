---
title: "SPacketResourcePackSend"
description: "public class SPacketResourcePackSend extends java.lang.Object implements Packet < INetHandlerPlayClient >"
package: "net/minecraft/network/play/server"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/network/play/server/SPacketResourcePackSend.html"
sourceType: javadoc
---

# SPacketResourcePackSend

## Class signature

```java
public class SPacketResourcePackSend extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketResourcePackSend()`
- `public SPacketResourcePackSend(java.lang.String urlIn, java.lang.String hashIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public java.lang.String getURL()`
- `public java.lang.String getHash()`
