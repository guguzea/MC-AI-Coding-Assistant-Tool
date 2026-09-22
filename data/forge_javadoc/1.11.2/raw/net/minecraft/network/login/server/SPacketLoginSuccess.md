---
title: "SPacketLoginSuccess"
description: "public class SPacketLoginSuccess extends java.lang.Object implements Packet<INetHandlerLoginClient>"
package: "net/minecraft/network/login/server"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/network/login/server/SPacketLoginSuccess.html"
sourceType: javadoc
---

# SPacketLoginSuccess

**Inheritance:** java.lang.Object → net.minecraft.network.login.server.SPacketLoginSuccess

## Class signature

```java
public class SPacketLoginSuccess extends java.lang.Object implements Packet<INetHandlerLoginClient>
```

## Constructors

- `SPacketLoginSuccess()`
- `SPacketLoginSuccess(com.mojang.authlib.GameProfile profileIn)`

## Methods

- `com.mojang.authlib.GameProfile getProfile()`
- `void processPacket(INetHandlerLoginClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`
