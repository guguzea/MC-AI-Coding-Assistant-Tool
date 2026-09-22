---
title: "SPacketDisconnect"
description: "public class SPacketDisconnect extends java.lang.Object implements Packet<INetHandlerLoginClient>"
package: "net/minecraft/network/login/server"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/network/login/server/SPacketDisconnect.html"
sourceType: javadoc
---

# SPacketDisconnect

**Inheritance:** java.lang.Object → net.minecraft.network.login.server.SPacketDisconnect

## Class signature

```java
public class SPacketDisconnect extends java.lang.Object implements Packet<INetHandlerLoginClient>
```

## Constructors

- `SPacketDisconnect()`
- `SPacketDisconnect(ITextComponent p_i46853_1_)`

## Methods

- `ITextComponent getReason()`
- `void processPacket(INetHandlerLoginClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`
