---
title: "NetHandlerStatusServer"
description: "public class NetHandlerStatusServer extends java.lang.Object implements INetHandlerStatusServer"
package: "net/minecraft/server/network"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/server/network/NetHandlerStatusServer.html"
sourceType: javadoc
---

# NetHandlerStatusServer

**Inheritance:** java.lang.Object → net.minecraft.server.network.NetHandlerStatusServer

## Class signature

```java
public class NetHandlerStatusServer extends java.lang.Object implements INetHandlerStatusServer
```

## Constructors

- `NetHandlerStatusServer(MinecraftServer serverIn, NetworkManager netManager)`

## Methods

- `void onDisconnect(ITextComponent reason)`
- `void processPing(CPacketPing packetIn)`
- `void processServerQuery(CPacketServerQuery packetIn)`
