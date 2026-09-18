---
title: "C17PacketCustomPayload"
description: "Passes this Packet on to the NetHandler for processing."
package: "net/minecraft/network/play/client"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/play/client/C17PacketCustomPayload.html"
sourceType: javadoc
---

# C17PacketCustomPayload

## Class signature

```java
public class C17PacketCustomPayload extends java.lang.Object implements Packet < INetHandlerPlayServer >
```

## Constructors

- `public C17PacketCustomPayload()`
- `public C17PacketCustomPayload(java.lang.String channelIn, PacketBuffer dataIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayServer handler)`
- `public java.lang.String getChannelName()`
- `public PacketBuffer getBufferData()`

## Description

Passes this Packet on to the NetHandler for processing.
