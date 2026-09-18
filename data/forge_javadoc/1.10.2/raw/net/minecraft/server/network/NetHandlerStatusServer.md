---
title: "NetHandlerStatusServer"
description: "public class NetHandlerStatusServer extends java.lang.Object implements INetHandlerStatusServer"
package: "net/minecraft/server/network"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/server/network/NetHandlerStatusServer.html"
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

- `public void onDisconnect( ITextComponent reason)`
- `public void processServerQuery( CPacketServerQuery packetIn)`
- `public void processPing( CPacketPing packetIn)`
