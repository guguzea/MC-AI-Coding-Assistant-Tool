---
title: "C18PacketSpectate"
description: "Passes this Packet on to the NetHandler for processing."
package: "net/minecraft/network/play/client"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/play/client/C18PacketSpectate.html"
sourceType: javadoc
---

# C18PacketSpectate

## Class signature

```java
public class C18PacketSpectate extends java.lang.Object implements Packet < INetHandlerPlayServer >
```

## Constructors

- `public C18PacketSpectate()`
- `public C18PacketSpectate(java.util.UUID id)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayServer handler)`
- `public Entity getEntity( WorldServer worldIn)`

## Description

Passes this Packet on to the NetHandler for processing.
