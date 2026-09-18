---
title: "SPacketPlayerListItem"
description: "public class SPacketPlayerListItem extends java.lang.Object implements Packet < INetHandlerPlayClient >"
package: "net/minecraft/network/play/server"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/network/play/server/SPacketPlayerListItem.html"
sourceType: javadoc
---

# SPacketPlayerListItem

## Class signature

```java
public class SPacketPlayerListItem extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketPlayerListItem()`
- `public SPacketPlayerListItem( SPacketPlayerListItem.Action actionIn, EntityPlayerMP ... playersIn)`
- `public SPacketPlayerListItem( SPacketPlayerListItem.Action actionIn, java.lang.Iterable< EntityPlayerMP > playersIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public java.util.List< SPacketPlayerListItem.AddPlayerData > getEntries()`
- `public SPacketPlayerListItem.Action getAction()`
- `public java.lang.String toString()`
