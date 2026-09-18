---
title: "CPacketClientStatus"
description: "public class CPacketClientStatus extends java.lang.Object implements Packet < INetHandlerPlayServer >"
package: "net/minecraft/network/play/client"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/network/play/client/CPacketClientStatus.html"
sourceType: javadoc
---

# CPacketClientStatus

## Class signature

```java
public class CPacketClientStatus extends java.lang.Object implements Packet < INetHandlerPlayServer >
```

## Constructors

- `public CPacketClientStatus()`
- `public CPacketClientStatus( CPacketClientStatus.State p_i46886_1_)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayServer handler)`
- `public CPacketClientStatus.State getStatus()`
