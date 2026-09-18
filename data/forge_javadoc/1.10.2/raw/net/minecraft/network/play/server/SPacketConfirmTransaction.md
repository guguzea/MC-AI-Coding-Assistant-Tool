---
title: "SPacketConfirmTransaction"
description: "public class SPacketConfirmTransaction extends java.lang.Object implements Packet < INetHandlerPlayClient >"
package: "net/minecraft/network/play/server"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/network/play/server/SPacketConfirmTransaction.html"
sourceType: javadoc
---

# SPacketConfirmTransaction

## Class signature

```java
public class SPacketConfirmTransaction extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketConfirmTransaction()`
- `public SPacketConfirmTransaction(int windowIdIn, short actionNumberIn, boolean acceptedIn)`

## Methods

- `public void processPacket( INetHandlerPlayClient handler)`
- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public int getWindowId()`
- `public short getActionNumber()`
- `public boolean wasAccepted()`
