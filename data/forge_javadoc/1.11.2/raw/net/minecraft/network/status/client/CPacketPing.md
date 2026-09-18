---
title: "CPacketPing"
description: "public class CPacketPing extends java.lang.Object implements Packet < INetHandlerStatusServer >"
package: "net/minecraft/network/status/client"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/network/status/client/CPacketPing.html"
sourceType: javadoc
---

# CPacketPing

## Class signature

```java
public class CPacketPing extends java.lang.Object implements Packet < INetHandlerStatusServer >
```

## Constructors

- `public CPacketPing()`
- `public CPacketPing(long clientTimeIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerStatusServer handler)`
- `public long getClientTime()`
