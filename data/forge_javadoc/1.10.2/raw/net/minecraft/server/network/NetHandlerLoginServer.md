---
title: "NetHandlerLoginServer"
description: "public class NetHandlerLoginServer extends java.lang.Object implements INetHandlerLoginServer , ITickable"
package: "net/minecraft/server/network"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/server/network/NetHandlerLoginServer.html"
sourceType: javadoc
---

# NetHandlerLoginServer

## Class signature

```java
public class NetHandlerLoginServer extends java.lang.Object implements INetHandlerLoginServer , ITickable
```

## Constructors

- `public NetHandlerLoginServer( MinecraftServer serverIn, NetworkManager networkManagerIn)`

## Methods

- `public void update()`
- `public void closeConnection(java.lang.String reason)`
- `public void tryAcceptPlayer()`
- `public void onDisconnect( ITextComponent reason)`
- `public java.lang.String getConnectionInfo()`
- `public void processLoginStart( CPacketLoginStart packetIn)`
- `public void processEncryptionResponse( CPacketEncryptionResponse packetIn)`
- `protected com.mojang.authlib.GameProfile getOfflineProfile(com.mojang.authlib.GameProfile original)`
