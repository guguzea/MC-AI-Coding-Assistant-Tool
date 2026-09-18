---
title: "NetHandlerStatusServer"
description: "public class NetHandlerStatusServer extends java.lang.Object implements INetHandlerStatusServer"
package: "net/minecraft/server/network"
version: "1.7.10"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/net/minecraft/server/network/NetHandlerStatusServer.html"
sourceType: javadoc
---

# NetHandlerStatusServer

## Class signature

```java
public class NetHandlerStatusServer extends java.lang.Object implements INetHandlerStatusServer
```

## Constructors

- `public NetHandlerStatusServer( MinecraftServer p_i45299_1_, NetworkManager p_i45299_2_)`

## Methods

- `public void onDisconnect( IChatComponent p_147231_1_)`
- `public void onConnectionStateTransition( EnumConnectionState p_147232_1_, EnumConnectionState p_147232_2_)`
- `public void onNetworkTick()`
- `public void processServerQuery( C00PacketServerQuery p_147312_1_)`
- `public void processPing( C01PacketPing p_147311_1_)`
