---
title: "CPacketEnchantItem"
description: "public class CPacketEnchantItem extends java.lang.Object implements Packet < INetHandlerPlayServer >"
package: "net/minecraft/network/play/client"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/network/play/client/CPacketEnchantItem.html"
sourceType: javadoc
---

# CPacketEnchantItem

## Class signature

```java
public class CPacketEnchantItem extends java.lang.Object implements Packet < INetHandlerPlayServer >
```

## Constructors

- `public CPacketEnchantItem()`
- `public CPacketEnchantItem(int windowIdIn, int buttonIn)`

## Methods

- `public void processPacket( INetHandlerPlayServer handler)`
- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public int getWindowId()`
- `public int getButton()`
