---
title: "NetHandlerHandshakeTCP"
description: "public class NetHandlerHandshakeTCP extends java.lang.Object implements INetHandlerHandshakeServer"
package: "net/minecraft/server/network"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/server/network/NetHandlerHandshakeTCP.html"
sourceType: javadoc
---

# NetHandlerHandshakeTCP

**Inheritance:** java.lang.Object → net.minecraft.server.network.NetHandlerHandshakeTCP

## Class signature

```java
public class NetHandlerHandshakeTCP extends java.lang.Object implements INetHandlerHandshakeServer
```

## Constructors

- `NetHandlerHandshakeTCP(MinecraftServer serverIn, NetworkManager netManager)`

## Methods

- `void onDisconnect(IChatComponent reason)` — Invoked when disconnecting, the parameter is a ChatComponent describing the reason for termination
- `void processHandshake(C00Handshake packetIn)` — There are two recognized intentions for initiating a handshake: logging in and acquiring server status.
