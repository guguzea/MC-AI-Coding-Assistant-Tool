---
title: "C0FPacketConfirmTransaction"
description: "Passes this Packet on to the NetHandler for processing."
package: "net/minecraft/network/play/client"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/play/client/C0FPacketConfirmTransaction.html"
sourceType: javadoc
---

# C0FPacketConfirmTransaction

## Class signature

```java
public class C0FPacketConfirmTransaction extends java.lang.Object implements Packet < INetHandlerPlayServer >
```

## Constructors

- `public C0FPacketConfirmTransaction()`
- `public C0FPacketConfirmTransaction(int windowId, short uid, boolean accepted)`

## Methods

- `public void processPacket( INetHandlerPlayServer handler)`
- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public int getWindowId()`
- `public short getUid()`

## Description

Passes this Packet on to the NetHandler for processing.
