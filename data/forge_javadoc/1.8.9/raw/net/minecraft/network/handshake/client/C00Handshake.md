---
title: "C00Handshake"
description: "Passes this Packet on to the NetHandler for processing."
package: "net/minecraft/network/handshake/client"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/handshake/client/C00Handshake.html"
sourceType: javadoc
---

# C00Handshake

## Class signature

```java
public class C00Handshake extends java.lang.Object implements Packet < INetHandlerHandshakeServer >
```

## Constructors

- `public C00Handshake()`
- `public C00Handshake(int version, java.lang.String ip, int port, EnumConnectionState requestedState)`
- `public C00Handshake(int protocol, java.lang.String address, int port, EnumConnectionState state, boolean addFMLMarker)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerHandshakeServer handler)`
- `public EnumConnectionState getRequestedState()`
- `public int getProtocolVersion()`
- `public boolean hasFMLMarker()`

## Description

Passes this Packet on to the NetHandler for processing.
