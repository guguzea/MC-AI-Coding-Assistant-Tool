---
title: "SPacketLoginSuccess"
description: "public class SPacketLoginSuccess extends java.lang.Object implements Packet < INetHandlerLoginClient >"
package: "net/minecraft/network/login/server"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/network/login/server/SPacketLoginSuccess.html"
sourceType: javadoc
---

# SPacketLoginSuccess

## Class signature

```java
public class SPacketLoginSuccess extends java.lang.Object implements Packet < INetHandlerLoginClient >
```

## Constructors

- `public SPacketLoginSuccess()`
- `public SPacketLoginSuccess(com.mojang.authlib.GameProfile profileIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerLoginClient handler)`
- `public com.mojang.authlib.GameProfile getProfile()`
