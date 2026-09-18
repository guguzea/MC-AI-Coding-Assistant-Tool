---
title: "S01PacketPong"
description: "Passes this Packet on to the NetHandler for processing."
package: "net/minecraft/network/status/server"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/status/server/S01PacketPong.html"
sourceType: javadoc
---

# S01PacketPong

## Class signature

```java
public class S01PacketPong extends java.lang.Object implements Packet < INetHandlerStatusClient >
```

## Constructors

- `public S01PacketPong()`
- `public S01PacketPong(long time)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerStatusClient handler)`

## Description

Passes this Packet on to the NetHandler for processing.
