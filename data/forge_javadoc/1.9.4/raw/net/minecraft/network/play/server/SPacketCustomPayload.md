---
title: "SPacketCustomPayload"
description: "public class SPacketCustomPayload extends java.lang.Object implements Packet < INetHandlerPlayClient >"
package: "net/minecraft/network/play/server"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/network/play/server/SPacketCustomPayload.html"
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
