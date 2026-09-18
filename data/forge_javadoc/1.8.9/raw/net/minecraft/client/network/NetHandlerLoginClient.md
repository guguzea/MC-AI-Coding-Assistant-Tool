---
title: "NetHandlerLoginClient"
description: "Invoked when disconnecting, the parameter is a ChatComponent describing the reason for termination"
package: "net/minecraft/client/network"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/client/network/NetHandlerLoginClient.html"
sourceType: javadoc
---

# NetHandlerLoginClient

## Class signature

```java
public class NetHandlerLoginClient extends java.lang.Object implements INetHandlerLoginClient
```

## Constructors

- `public NetHandlerLoginClient( NetworkManager p_i45059_1_, Minecraft mcIn, GuiScreen p_i45059_3_)`

## Methods

- `public void handleEncryptionRequest( S01PacketEncryptionRequest packetIn)`
- `public void handleLoginSuccess( S02PacketLoginSuccess packetIn)`
- `public void onDisconnect( IChatComponent reason)`
- `public void handleDisconnect( S00PacketDisconnect packetIn)`
- `public void handleEnableCompression( S03PacketEnableCompression packetIn)`

## Description

Invoked when disconnecting, the parameter is a ChatComponent describing the reason for termination
