---
title: "CPacketPlayerTryUseItem"
description: "public class CPacketPlayerTryUseItem extends java.lang.Object implements Packet < INetHandlerPlayServer >"
package: "net/minecraft/network/play/client"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/network/play/client/CPacketPlayerTryUseItem.html"
sourceType: javadoc
---

# CPacketPlayerTryUseItem

## Class signature

```java
public class CPacketPlayerTryUseItem extends java.lang.Object implements Packet < INetHandlerPlayServer >
```

## Constructors

- `public CPacketPlayerTryUseItem()`
- `public CPacketPlayerTryUseItem( EnumHand handIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayServer handler)`
- `public EnumHand getHand()`
