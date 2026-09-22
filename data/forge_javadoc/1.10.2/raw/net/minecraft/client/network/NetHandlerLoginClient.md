---
title: "NetHandlerLoginClient"
description: "public class NetHandlerLoginClient extends java.lang.Object implements INetHandlerLoginClient"
package: "net/minecraft/client/network"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/client/network/NetHandlerLoginClient.html"
sourceType: javadoc
---

# NetHandlerLoginClient

**Inheritance:** java.lang.Object → net.minecraft.client.network.NetHandlerLoginClient

## Class signature

```java
public class NetHandlerLoginClient extends java.lang.Object implements INetHandlerLoginClient
```

## Constructors

- `NetHandlerLoginClient(NetworkManager networkManagerIn, Minecraft mcIn, GuiScreen previousScreenIn)`

## Methods

- `void handleDisconnect(SPacketDisconnect packetIn)`
- `void handleEnableCompression(SPacketEnableCompression packetIn)`
- `void handleEncryptionRequest(SPacketEncryptionRequest packetIn)`
- `void handleLoginSuccess(SPacketLoginSuccess packetIn)`
- `void onDisconnect(ITextComponent reason)`
