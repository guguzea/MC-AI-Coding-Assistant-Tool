---
title: "NetHandlerHandshakeTCP"
description: "Invoked when disconnecting, the parameter is a ChatComponent describing the reason for termination"
package: "net/minecraft/server/network"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/server/network/NetHandlerHandshakeTCP.html"
sourceType: javadoc
---

# NetHandlerHandshakeTCP

## Class signature

```java
public class NetHandlerHandshakeTCP extends java.lang.Object implements INetHandlerHandshakeServer
```

## Constructors

- `public NetHandlerHandshakeTCP( MinecraftServer serverIn, NetworkManager netManager)`

## Methods

- `public void processHandshake( C00Handshake packetIn)`
- `public void onDisconnect( IChatComponent reason)`

## Description

Invoked when disconnecting, the parameter is a ChatComponent describing the reason for termination
