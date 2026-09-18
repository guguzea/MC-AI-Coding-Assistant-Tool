---
title: "NetHandlerLoginClient"
description: "public class NetHandlerLoginClient extends java.lang.Object implements INetHandlerLoginClient"
package: "net/minecraft/client/network"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/client/network/NetHandlerLoginClient.html"
sourceType: javadoc
---

# NetHandlerLoginClient

## Class signature

```java
public class NetHandlerLoginClient extends java.lang.Object implements INetHandlerLoginClient
```

## Constructors

- `public NetHandlerLoginClient( NetworkManager networkManagerIn, Minecraft mcIn, @Nullable GuiScreen previousScreenIn)`

## Methods

- `public void handleEncryptionRequest( SPacketEncryptionRequest packetIn)`
- `public void handleLoginSuccess( SPacketLoginSuccess packetIn)`
- `public void onDisconnect( ITextComponent reason)`
- `public void handleDisconnect( SPacketDisconnect packetIn)`
- `public void handleEnableCompression( SPacketEnableCompression packetIn)`
