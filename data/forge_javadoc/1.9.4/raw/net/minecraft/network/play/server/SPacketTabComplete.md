---
title: "SPacketTabComplete"
description: "public class SPacketTabComplete extends java.lang.Object implements Packet < INetHandlerPlayClient >"
package: "net/minecraft/network/play/server"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/network/play/server/SPacketTabComplete.html"
sourceType: javadoc
---

# SPacketTabComplete

## Class signature

```java
public class SPacketTabComplete extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketTabComplete()`
- `public SPacketTabComplete(java.lang.String[] matchesIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public java.lang.String[] getMatches()`
