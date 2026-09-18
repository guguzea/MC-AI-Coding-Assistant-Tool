---
title: "S38PacketPlayerListItem"
description: "Passes this Packet on to the NetHandler for processing."
package: "net/minecraft/network/play/server"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/play/server/S38PacketPlayerListItem.html"
sourceType: javadoc
---

# S38PacketPlayerListItem

## Class signature

```java
public class S38PacketPlayerListItem extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public S38PacketPlayerListItem()`
- `public S38PacketPlayerListItem( S38PacketPlayerListItem.Action actionIn, EntityPlayerMP ... players)`
- `public S38PacketPlayerListItem( S38PacketPlayerListItem.Action actionIn, java.lang.Iterable< EntityPlayerMP > players)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public java.util.List< S38PacketPlayerListItem.AddPlayerData > func_179767_a()`
- `public S38PacketPlayerListItem.Action func_179768_b()`
- `public java.lang.String toString()`

## Description

Passes this Packet on to the NetHandler for processing.
