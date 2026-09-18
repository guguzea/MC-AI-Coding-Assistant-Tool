---
title: "S00PacketKeepAlive"
description: "Passes this Packet on to the NetHandler for processing."
package: "net/minecraft/network/play/server"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/play/server/S00PacketKeepAlive.html"
sourceType: javadoc
---

# S00PacketKeepAlive

## Class signature

```java
public class S00PacketKeepAlive extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public S00PacketKeepAlive()`
- `public S00PacketKeepAlive(int idIn)`

## Methods

- `public void processPacket( INetHandlerPlayClient handler)`
- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public int func_149134_c()`

## Description

Passes this Packet on to the NetHandler for processing.
