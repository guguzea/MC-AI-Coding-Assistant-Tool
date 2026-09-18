---
title: "NetHandlerLoginServer"
description: "public class NetHandlerLoginServer extends java.lang.Object implements INetHandlerLoginServer , ITickable"
package: "net/minecraft/server/network"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/server/network/NetHandlerLoginServer.html"
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
- `public void disconnect( ITextComponent reason)`
- `public void tryAcceptPlayer()`
- `public void onDisconnect( ITextComponent reason)`
- `public java.lang.String getConnectionInfo()`
- `public void processLoginStart( CPacketLoginStart packetIn)`
- `public void processEncryptionResponse( CPacketEncryptionResponse packetIn)`
- `protected GameProfile getOfflineProfile(GameProfile original)`
