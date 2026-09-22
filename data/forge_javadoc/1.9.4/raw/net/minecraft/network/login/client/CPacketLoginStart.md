---
title: "CPacketLoginStart"
description: "public class CPacketLoginStart extends java.lang.Object implements Packet<INetHandlerLoginServer>"
package: "net/minecraft/network/login/client"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/network/login/client/CPacketLoginStart.html"
sourceType: javadoc
---

# CPacketLoginStart

**Inheritance:** java.lang.Object → net.minecraft.network.login.client.CPacketLoginStart

## Class signature

```java
public class CPacketLoginStart extends java.lang.Object implements Packet<INetHandlerLoginServer>
```

## Constructors

- `CPacketLoginStart()`
- `CPacketLoginStart(com.mojang.authlib.GameProfile profileIn)`

## Methods

- `com.mojang.authlib.GameProfile getProfile()`
- `void processPacket(INetHandlerLoginServer handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`
