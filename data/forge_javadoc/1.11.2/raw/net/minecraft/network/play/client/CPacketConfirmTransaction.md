---
title: "CPacketConfirmTransaction"
description: "public class CPacketConfirmTransaction extends java.lang.Object implements Packet < INetHandlerPlayServer >"
package: "net/minecraft/network/play/client"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/network/play/client/CPacketConfirmTransaction.html"
sourceType: javadoc
---

# CPacketConfirmTransaction

## Class signature

```java
public class CPacketConfirmTransaction extends java.lang.Object implements Packet < INetHandlerPlayServer >
```

## Constructors

- `public CPacketConfirmTransaction()`
- `public CPacketConfirmTransaction(int windowIdIn, short uidIn, boolean acceptedIn)`

## Methods

- `public void processPacket( INetHandlerPlayServer handler)`
- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public int getWindowId()`
- `public short getUid()`
