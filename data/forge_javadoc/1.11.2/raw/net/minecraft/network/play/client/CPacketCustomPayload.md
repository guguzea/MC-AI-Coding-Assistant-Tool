---
title: "CPacketCustomPayload"
description: "public class CPacketCustomPayload extends java.lang.Object implements Packet < INetHandlerPlayServer >"
package: "net/minecraft/network/play/client"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/network/play/client/CPacketCustomPayload.html"
sourceType: javadoc
---

# CPacketCustomPayload

## Class signature

```java
public class CPacketCustomPayload extends java.lang.Object implements Packet < INetHandlerPlayServer >
```

## Constructors

- `public CPacketCustomPayload()`
- `public CPacketCustomPayload(java.lang.String channelIn, PacketBuffer bufIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayServer handler)`
- `public java.lang.String getChannelName()`
- `public PacketBuffer getBufferData()`
