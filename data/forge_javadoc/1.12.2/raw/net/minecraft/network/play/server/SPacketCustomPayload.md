---
title: "SPacketCustomPayload"
description: "public class SPacketCustomPayload extends java.lang.Object implements Packet < INetHandlerPlayClient >"
package: "net/minecraft/network/play/server"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/network/play/server/SPacketCustomPayload.html"
sourceType: javadoc
---

# SPacketCustomPayload

## Class signature

```java
public class SPacketCustomPayload extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketCustomPayload()`
- `public SPacketCustomPayload(java.lang.String channelIn, PacketBuffer bufIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public java.lang.String getChannelName()`
- `public PacketBuffer getBufferData()`
