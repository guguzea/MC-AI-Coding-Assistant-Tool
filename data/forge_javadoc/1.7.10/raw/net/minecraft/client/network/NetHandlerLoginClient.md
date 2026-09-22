---
title: "NetHandlerLoginClient"
description: "public class NetHandlerLoginClient extends java.lang.Object implements INetHandlerLoginClient"
package: "net/minecraft/client/network"
version: "1.7.10"
forgeBuild: "10.13.4.1614"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/net/minecraft/client/network/NetHandlerLoginClient.html"
sourceType: javadoc
---

# NetHandlerLoginClient

**Inheritance:** java.lang.Object → net.minecraft.client.network.NetHandlerLoginClient

## Class signature

```java
public class NetHandlerLoginClient extends java.lang.Object implements INetHandlerLoginClient
```

## Constructors

- `NetHandlerLoginClient(NetworkManager p_i45059_1_, Minecraft p_i45059_2_, GuiScreen p_i45059_3_)`

## Methods

- `void handleDisconnect(S00PacketDisconnect p_147388_1_)`
- `void handleEncryptionRequest(S01PacketEncryptionRequest p_147389_1_)`
- `void handleLoginSuccess(S02PacketLoginSuccess p_147390_1_)`
- `void onConnectionStateTransition(EnumConnectionState p_147232_1_, EnumConnectionState p_147232_2_)`
- `void onDisconnect(IChatComponent p_147231_1_)`
- `void onNetworkTick()`
