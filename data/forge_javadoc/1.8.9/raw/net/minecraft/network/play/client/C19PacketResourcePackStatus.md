---
title: "C19PacketResourcePackStatus"
description: "Passes this Packet on to the NetHandler for processing."
package: "net/minecraft/network/play/client"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/play/client/C19PacketResourcePackStatus.html"
sourceType: javadoc
---

# C19PacketResourcePackStatus

## Class signature

```java
public class C19PacketResourcePackStatus extends java.lang.Object implements Packet < INetHandlerPlayServer >
```

## Constructors

- `public C19PacketResourcePackStatus()`
- `public C19PacketResourcePackStatus(java.lang.String hashIn, C19PacketResourcePackStatus.Action statusIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayServer handler)`

## Description

Passes this Packet on to the NetHandler for processing.
