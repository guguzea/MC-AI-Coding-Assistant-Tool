---
title: "CPacketLoginStart"
description: "public class CPacketLoginStart extends java.lang.Object implements Packet<INetHandlerLoginServer>"
package: "net/minecraft/network/login/client"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/network/login/client/CPacketLoginStart.html"
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
- `CPacketLoginStart(GameProfile profileIn)`

## Methods

- `GameProfile getProfile()`
- `void processPacket(INetHandlerLoginServer handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`
