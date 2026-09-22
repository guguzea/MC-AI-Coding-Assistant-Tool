---
title: "SPacketEnableCompression"
description: "public class SPacketEnableCompression extends java.lang.Object implements Packet<INetHandlerLoginClient>"
package: "net/minecraft/network/login/server"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/network/login/server/SPacketEnableCompression.html"
sourceType: javadoc
---

# SPacketEnableCompression

**Inheritance:** java.lang.Object → net.minecraft.network.login.server.SPacketEnableCompression

## Class signature

```java
public class SPacketEnableCompression extends java.lang.Object implements Packet<INetHandlerLoginClient>
```

## Constructors

- `SPacketEnableCompression()`
- `SPacketEnableCompression(int thresholdIn)`

## Methods

- `int getCompressionThreshold()`
- `void processPacket(INetHandlerLoginClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`
