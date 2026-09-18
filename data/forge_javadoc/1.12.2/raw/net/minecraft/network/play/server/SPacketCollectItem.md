---
title: "SPacketCollectItem"
description: "public class SPacketCollectItem extends java.lang.Object implements Packet < INetHandlerPlayClient >"
package: "net/minecraft/network/play/server"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/network/play/server/SPacketCollectItem.html"
sourceType: javadoc
---

# SPacketCollectItem

## Class signature

```java
public class SPacketCollectItem extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketCollectItem()`
- `public SPacketCollectItem(int p_i47316_1_, int p_i47316_2_, int p_i47316_3_)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public int getCollectedItemEntityID()`
- `public int getEntityID()`
- `public int getAmount()`
