---
title: "NetHandlerLoginServer"
description: "Invoked when disconnecting, the parameter is a ChatComponent describing the reason for termination"
package: "net/minecraft/server/network"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/server/network/NetHandlerLoginServer.html"
sourceType: javadoc
---

# NetHandlerLoginServer

## Class signature

```java
public class NetHandlerLoginServer extends java.lang.Object implements INetHandlerLoginServer , ITickable
```

## Constructors

- `public NetHandlerLoginServer( MinecraftServer p_i45298_1_, NetworkManager p_i45298_2_)`

## Methods

- `public void update()`
- `public void closeConnection(java.lang.String reason)`
- `public void tryAcceptPlayer()`
- `public void onDisconnect( IChatComponent reason)`
- `public java.lang.String getConnectionInfo()`
- `public void processLoginStart( C00PacketLoginStart packetIn)`
- `public void processEncryptionResponse( C01PacketEncryptionResponse packetIn)`
- `protected GameProfile getOfflineProfile(GameProfile original)`

## Description

Invoked when disconnecting, the parameter is a ChatComponent describing the reason for termination
