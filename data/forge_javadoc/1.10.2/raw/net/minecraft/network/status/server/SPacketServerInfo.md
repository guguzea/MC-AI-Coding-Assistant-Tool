---
title: "SPacketServerInfo"
description: "public class SPacketServerInfo extends java.lang.Object implements Packet<INetHandlerStatusClient>"
package: "net/minecraft/network/status/server"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/network/status/server/SPacketServerInfo.html"
sourceType: javadoc
---

# SPacketServerInfo

**Inheritance:** java.lang.Object → net.minecraft.network.status.server.SPacketServerInfo

## Class signature

```java
public class SPacketServerInfo extends java.lang.Object implements Packet<INetHandlerStatusClient>
```

## Constructors

- `SPacketServerInfo()`
- `SPacketServerInfo(ServerStatusResponse responseIn)`

## Methods

- `ServerStatusResponse getResponse()`
- `void processPacket(INetHandlerStatusClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`

## Fields

- `static com.google.gson.Gson GSON`
