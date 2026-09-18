---
title: "S02PacketLoginSuccess"
description: "Passes this Packet on to the NetHandler for processing."
package: "net/minecraft/network/login/server"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/login/server/S02PacketLoginSuccess.html"
sourceType: javadoc
---

# S02PacketLoginSuccess

## Class signature

```java
public class S02PacketLoginSuccess extends java.lang.Object implements Packet < INetHandlerLoginClient >
```

## Constructors

- `public S02PacketLoginSuccess()`
- `public S02PacketLoginSuccess(GameProfile profileIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerLoginClient handler)`
- `public GameProfile getProfile()`

## Description

Passes this Packet on to the NetHandler for processing.
