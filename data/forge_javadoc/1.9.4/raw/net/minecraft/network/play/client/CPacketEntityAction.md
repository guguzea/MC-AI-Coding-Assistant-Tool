---
title: "CPacketEntityAction"
description: "public class CPacketEntityAction extends java.lang.Object implements Packet < INetHandlerPlayServer >"
package: "net/minecraft/network/play/client"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/network/play/client/CPacketEntityAction.html"
sourceType: javadoc
---

# CPacketEntityAction

## Class signature

```java
public class CPacketEntityAction extends java.lang.Object implements Packet < INetHandlerPlayServer >
```

## Constructors

- `public CPacketEntityAction()`
- `public CPacketEntityAction( Entity entityIn, CPacketEntityAction.Action actionIn)`
- `public CPacketEntityAction( Entity entityIn, CPacketEntityAction.Action actionIn, int auxDataIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayServer handler)`
- `public CPacketEntityAction.Action getAction()`
- `public int getAuxData()`
