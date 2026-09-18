---
title: "CPacketSpectate"
description: "public class CPacketSpectate extends java.lang.Object implements Packet < INetHandlerPlayServer >"
package: "net/minecraft/network/play/client"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/network/play/client/CPacketSpectate.html"
sourceType: javadoc
---

# CPacketSpectate

## Class signature

```java
public class CPacketSpectate extends java.lang.Object implements Packet < INetHandlerPlayServer >
```

## Constructors

- `public CPacketSpectate()`
- `public CPacketSpectate(java.util.UUID uniqueIdIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayServer handler)`
- `@Nullable public Entity getEntity( WorldServer worldIn)`
