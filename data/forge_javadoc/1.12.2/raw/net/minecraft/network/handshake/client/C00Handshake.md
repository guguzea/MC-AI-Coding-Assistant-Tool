---
title: "C00Handshake"
description: "public class C00Handshake extends java.lang.Object implements Packet<INetHandlerHandshakeServer>"
package: "net/minecraft/network/handshake/client"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/network/handshake/client/C00Handshake.html"
sourceType: javadoc
---

# C00Handshake

**Inheritance:** java.lang.Object → net.minecraft.network.handshake.client.C00Handshake

## Class signature

```java
public class C00Handshake extends java.lang.Object implements Packet<INetHandlerHandshakeServer>
```

## Constructors

- `C00Handshake()`
- `C00Handshake(java.lang.String p_i47613_1_, int p_i47613_2_, EnumConnectionState p_i47613_3_)`
- `C00Handshake(java.lang.String address, int port, EnumConnectionState state, boolean addFMLMarker)`

## Methods

- `int getProtocolVersion()`
- `EnumConnectionState getRequestedState()`
- `boolean hasFMLMarker()`
- `void processPacket(INetHandlerHandshakeServer handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`
