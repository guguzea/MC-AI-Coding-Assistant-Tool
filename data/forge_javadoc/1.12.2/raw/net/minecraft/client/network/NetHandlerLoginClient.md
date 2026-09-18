---
title: "NetHandlerLoginClient"
description: "public class NetHandlerLoginClient extends java.lang.Object implements INetHandlerLoginClient"
package: "net/minecraft/client/network"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/client/network/NetHandlerLoginClient.html"
sourceType: javadoc
---

# NetHandlerLoginClient

## Class signature

```java
public class NetHandlerLoginClient extends java.lang.Object implements INetHandlerLoginClient
```

## Constructors

- `public NetHandlerLoginClient( NetworkManager networkManagerIn, Minecraft mcIn, GuiScreen previousScreenIn)`

## Methods

- `public void handleEncryptionRequest( SPacketEncryptionRequest packetIn)`
- `public void handleLoginSuccess( SPacketLoginSuccess packetIn)`
- `public void onDisconnect( ITextComponent reason)`
- `public void handleDisconnect( SPacketDisconnect packetIn)`
- `public void handleEnableCompression( SPacketEnableCompression packetIn)`
