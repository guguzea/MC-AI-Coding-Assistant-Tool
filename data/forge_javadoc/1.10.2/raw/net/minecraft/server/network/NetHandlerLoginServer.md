---
title: "NetHandlerLoginServer"
description: "public class NetHandlerLoginServer extends java.lang.Object implements INetHandlerLoginServer, ITickable"
package: "net/minecraft/server/network"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/server/network/NetHandlerLoginServer.html"
sourceType: javadoc
---

# NetHandlerLoginServer

**Inheritance:** java.lang.Object → net.minecraft.server.network.NetHandlerLoginServer

## Class signature

```java
public class NetHandlerLoginServer extends java.lang.Object implements INetHandlerLoginServer, ITickable
```

## Constructors

- `NetHandlerLoginServer(MinecraftServer serverIn, NetworkManager networkManagerIn)`

## Methods

- `void closeConnection(java.lang.String reason)`
- `java.lang.String getConnectionInfo()`
- `protected com.mojang.authlib.GameProfile getOfflineProfile(com.mojang.authlib.GameProfile original)`
- `void onDisconnect(ITextComponent reason)`
- `void processEncryptionResponse(CPacketEncryptionResponse packetIn)`
- `void processLoginStart(CPacketLoginStart packetIn)`
- `void tryAcceptPlayer()`
- `void update()`

## Fields

- `NetworkManager networkManager`
