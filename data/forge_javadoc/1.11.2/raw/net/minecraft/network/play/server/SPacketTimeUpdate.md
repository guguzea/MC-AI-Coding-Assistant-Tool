---
title: "SPacketTimeUpdate"
description: "public class SPacketTimeUpdate extends java.lang.Object implements Packet < INetHandlerPlayClient >"
package: "net/minecraft/network/play/server"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/network/play/server/SPacketTimeUpdate.html"
sourceType: javadoc
---

# SPacketTimeUpdate

## Class signature

```java
public class SPacketTimeUpdate extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketTimeUpdate()`
- `public SPacketTimeUpdate(long totalWorldTimeIn, long worldTimeIn, boolean p_i46902_5_)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public long getTotalWorldTime()`
- `public long getWorldTime()`
