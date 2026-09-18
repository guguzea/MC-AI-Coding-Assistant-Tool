---
title: "C00Handshake"
description: "public class C00Handshake extends java.lang.Object implements Packet < INetHandlerHandshakeServer >"
package: "net/minecraft/network/handshake/client"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/network/handshake/client/C00Handshake.html"
sourceType: javadoc
---

# C00Handshake

## Class signature

```java
public class C00Handshake extends java.lang.Object implements Packet < INetHandlerHandshakeServer >
```

## Constructors

- `public C00Handshake()`
- `public C00Handshake(java.lang.String p_i47613_1_, int p_i47613_2_, EnumConnectionState p_i47613_3_)`
- `public C00Handshake(java.lang.String address, int port, EnumConnectionState state, boolean addFMLMarker)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerHandshakeServer handler)`
- `public EnumConnectionState getRequestedState()`
- `public int getProtocolVersion()`
- `public boolean hasFMLMarker()`
