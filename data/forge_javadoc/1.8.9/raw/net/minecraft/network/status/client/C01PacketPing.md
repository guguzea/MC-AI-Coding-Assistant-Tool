---
title: "C01PacketPing"
description: "Passes this Packet on to the NetHandler for processing."
package: "net/minecraft/network/status/client"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/status/client/C01PacketPing.html"
sourceType: javadoc
---

# C01PacketPing

## Class signature

```java
public class C01PacketPing extends java.lang.Object implements Packet < INetHandlerStatusServer >
```

## Constructors

- `public C01PacketPing()`
- `public C01PacketPing(long ping)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerStatusServer handler)`
- `public long getClientTime()`

## Description

Passes this Packet on to the NetHandler for processing.
