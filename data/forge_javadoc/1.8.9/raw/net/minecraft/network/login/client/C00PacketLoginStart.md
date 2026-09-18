---
title: "C00PacketLoginStart"
description: "Passes this Packet on to the NetHandler for processing."
package: "net/minecraft/network/login/client"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/login/client/C00PacketLoginStart.html"
sourceType: javadoc
---

# C00PacketLoginStart

## Class signature

```java
public class C00PacketLoginStart extends java.lang.Object implements Packet < INetHandlerLoginServer >
```

## Constructors

- `public C00PacketLoginStart()`
- `public C00PacketLoginStart(GameProfile profileIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerLoginServer handler)`
- `public GameProfile getProfile()`

## Description

Passes this Packet on to the NetHandler for processing.
