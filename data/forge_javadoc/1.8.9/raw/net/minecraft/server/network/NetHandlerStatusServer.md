---
title: "NetHandlerStatusServer"
description: "Invoked when disconnecting, the parameter is a ChatComponent describing the reason for termination"
package: "net/minecraft/server/network"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/server/network/NetHandlerStatusServer.html"
sourceType: javadoc
---

# NetHandlerStatusServer

## Class signature

```java
public class NetHandlerStatusServer extends java.lang.Object implements INetHandlerStatusServer
```

## Constructors

- `public NetHandlerStatusServer( MinecraftServer serverIn, NetworkManager netManager)`

## Methods

- `public void onDisconnect( IChatComponent reason)`
- `public void processServerQuery( C00PacketServerQuery packetIn)`
- `public void processPing( C01PacketPing packetIn)`

## Description

Invoked when disconnecting, the parameter is a ChatComponent describing the reason for termination
