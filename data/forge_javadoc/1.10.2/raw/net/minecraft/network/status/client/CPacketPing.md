---
title: "CPacketPing"
description: "public class CPacketPing extends java.lang.Object implements Packet < INetHandlerStatusServer >"
package: "net/minecraft/network/status/client"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/network/status/client/CPacketPing.html"
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
