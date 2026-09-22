---
title: "SPacketEnableCompression"
description: "public class SPacketEnableCompression extends java.lang.Object implements Packet<INetHandlerLoginClient>"
package: "net/minecraft/network/login/server"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/network/login/server/SPacketEnableCompression.html"
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
