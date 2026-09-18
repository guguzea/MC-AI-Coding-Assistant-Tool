---
title: "C16PacketClientStatus"
description: "Passes this Packet on to the NetHandler for processing."
package: "net/minecraft/network/play/client"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/play/client/C16PacketClientStatus.html"
sourceType: javadoc
---

# C16PacketClientStatus

## Class signature

```java
public class C16PacketClientStatus extends java.lang.Object implements Packet < INetHandlerPlayServer >
```

## Constructors

- `public C16PacketClientStatus()`
- `public C16PacketClientStatus( C16PacketClientStatus.EnumState statusIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayServer handler)`
- `public C16PacketClientStatus.EnumState getStatus()`

## Description

Passes this Packet on to the NetHandler for processing.
