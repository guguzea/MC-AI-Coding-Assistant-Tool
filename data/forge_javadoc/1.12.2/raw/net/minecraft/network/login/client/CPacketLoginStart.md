---
title: "CPacketLoginStart"
description: "public class CPacketLoginStart extends java.lang.Object implements Packet < INetHandlerLoginServer >"
package: "net/minecraft/network/login/client"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/network/login/client/CPacketLoginStart.html"
sourceType: javadoc
---

# CPacketLoginStart

## Class signature

```java
public class CPacketLoginStart extends java.lang.Object implements Packet < INetHandlerLoginServer >
```

## Constructors

- `public CPacketLoginStart()`
- `public CPacketLoginStart(GameProfile profileIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerLoginServer handler)`
- `public GameProfile getProfile()`
