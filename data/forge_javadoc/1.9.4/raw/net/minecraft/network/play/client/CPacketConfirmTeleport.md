---
title: "CPacketConfirmTeleport"
description: "public class CPacketConfirmTeleport extends java.lang.Object implements Packet < INetHandlerPlayServer >"
package: "net/minecraft/network/play/client"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/network/play/client/CPacketConfirmTeleport.html"
sourceType: javadoc
---

# CPacketConfirmTeleport

## Class signature

```java
public class CPacketConfirmTeleport extends java.lang.Object implements Packet < INetHandlerPlayServer >
```

## Constructors

- `public CPacketConfirmTeleport()`
- `public CPacketConfirmTeleport(int teleportIdIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayServer handler)`
- `public int getTeleportId()`
