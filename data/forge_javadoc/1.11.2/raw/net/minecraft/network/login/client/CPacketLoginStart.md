---
title: "CPacketLoginStart"
description: "public class CPacketLoginStart extends java.lang.Object implements Packet < INetHandlerLoginServer >"
package: "net/minecraft/network/login/client"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/network/login/client/CPacketLoginStart.html"
sourceType: javadoc
---

# CPacketLoginStart

## Class signature

```java
public class CPacketLoginStart extends java.lang.Object implements Packet < INetHandlerLoginServer >
```

## Constructors

- `public CPacketLoginStart()`
- `public CPacketLoginStart(com.mojang.authlib.GameProfile profileIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerLoginServer handler)`
- `public com.mojang.authlib.GameProfile getProfile()`
